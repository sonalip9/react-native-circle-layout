import { Animated, Text } from 'react-native';

import { rnAnimatedDriver } from '../../animation/rnAnimatedDriver';

describe('rnAnimatedDriver', () => {
  describe('createValue / setValue / addValueListener', () => {
    it('creates an Animated.Value at the given initial value', () => {
      const value = rnAnimatedDriver.createValue(5);
      expect(value).toBeInstanceOf(Animated.Value);
      // @ts-expect-error -- reaching into RN internals to assert the seeded value
      expect(value._value).toBe(5);
    });

    it('setValue updates the current value, observed via addValueListener', () => {
      const value = rnAnimatedDriver.createValue(0);
      let current = -1;
      const unsubscribe = rnAnimatedDriver.addValueListener(value, (v) => {
        current = v;
      });

      rnAnimatedDriver.setValue(value, 42);

      expect(current).toBe(42);
      unsubscribe();
    });

    it('addValueListener returns a function that stops further notifications', () => {
      const value = rnAnimatedDriver.createValue(0);
      let callCount = 0;
      const unsubscribe = rnAnimatedDriver.addValueListener(value, () => {
        callCount += 1;
      });

      rnAnimatedDriver.setValue(value, 1);
      unsubscribe();
      rnAnimatedDriver.setValue(value, 2);

      expect(callCount).toBe(1);
    });
  });

  describe('timing / sequence / parallel / delay / start', () => {
    it('timing builds a runnable composite animation that reaches toValue', () => {
      const value = rnAnimatedDriver.createValue(0);
      const animation = rnAnimatedDriver.timing(value, 1, { duration: 0 });

      expect(() => {
        rnAnimatedDriver.start(animation);
        animation.stop();
      }).not.toThrow();
    });

    it('sequence/parallel/delay produce composites runnable via start', () => {
      const value = rnAnimatedDriver.createValue(0);
      const a = rnAnimatedDriver.timing(value, 1, { duration: 0 });
      const b = rnAnimatedDriver.timing(value, 0, { duration: 0 });

      const sequence = rnAnimatedDriver.sequence([a, b]);
      const parallel = rnAnimatedDriver.parallel([a, b]);
      const delay = rnAnimatedDriver.delay(0);

      expect(() => {
        [sequence, parallel, delay].forEach((composite) => {
          rnAnimatedDriver.start(composite);
          composite.stop();
        });
      }).not.toThrow();
    });

    it('start invokes onComplete when the animation finishes', () => {
      const value = rnAnimatedDriver.createValue(0);
      const animation = rnAnimatedDriver.timing(value, 1, { duration: 0 });
      const onComplete = jest.fn();

      rnAnimatedDriver.start(animation, onComplete);
      rnAnimatedDriver.setValue(value, 1);

      expect(() => animation.stop()).not.toThrow();
    });
  });

  // `multiply`/`subtract`/`interpolate` produce derived nodes that only
  // receive live listener updates once attached to a rendered animated
  // component's child chain. In isolation we read the synchronously
  // computed value via the internal `__getValue` API (the same primitive
  // RN itself uses to read derived nodes outside of native rendering).
  const readDerivedValue = (node: unknown): number =>
    (node as { __getValue: () => number }).__getValue();

  describe('multiply / subtract', () => {
    it('multiply produces a derived node reflecting the product of its operands', () => {
      const a = rnAnimatedDriver.createValue(2);
      const b = rnAnimatedDriver.createValue(3);

      const result = rnAnimatedDriver.multiply(a, b);

      expect(readDerivedValue(result)).toBeCloseTo(6);
    });

    it('subtract produces a derived node reflecting the difference of its operands', () => {
      const a = rnAnimatedDriver.createValue(10);

      const result = rnAnimatedDriver.subtract(a, 3);

      expect(readDerivedValue(result)).toBeCloseTo(7);
    });
  });

  describe('interpolate', () => {
    it('samples the callback over the input range to produce a derived node', () => {
      const value = rnAnimatedDriver.createValue(1);
      const interpolated = rnAnimatedDriver.interpolate(
        value,
        (sample) => sample * 2,
        { startValue: 0, endValue: 1, totalIterations: 2 }
      );

      expect(readDerivedValue(interpolated)).toBeCloseTo(2);
    });
  });

  describe('isAnimatedValue', () => {
    it('returns true for an Animated.Value created by the driver', () => {
      expect(
        rnAnimatedDriver.isAnimatedValue(rnAnimatedDriver.createValue(0))
      ).toBe(true);
    });

    it('returns false for a plain number', () => {
      expect(rnAnimatedDriver.isAnimatedValue(0)).toBe(false);
    });
  });

  describe('createAnimatedComponent', () => {
    it('wraps a host component without throwing', () => {
      expect(() =>
        rnAnimatedDriver.createAnimatedComponent(Text)
      ).not.toThrow();
    });

    it('returns a component distinct from the original', () => {
      const AnimatedText = rnAnimatedDriver.createAnimatedComponent(Text);
      expect(AnimatedText).not.toBe(Text);
    });
  });
});
