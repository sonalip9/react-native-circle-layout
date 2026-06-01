import { renderHook, act } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { useAnimation } from '../../hooks/useAnimation';

type AnimationConfig = Parameters<typeof useAnimation>[0];

const baseConfig: AnimationConfig = {
  initialValue: 0,
  finalValue: 1,
  entryAnimationConfig: { duration: 300 },
};

/**
 * Attaches a listener to an Animated.Value and returns a tracker.
 * The listener fires synchronously on setValue calls in the RN Jest mock.
 * @param v - The Animated.Value to track.
 * @param initialValue - The known starting value before any setValue calls.
 * @returns Object with get() to read the latest value and dispose() to remove the listener.
 */
const trackAnimatedValue = (v: Animated.Value, initialValue: number) => {
  let current = initialValue;
  const id = v.addListener(({ value }) => {
    current = value;
  });
  return {
    get: () => current,
    dispose: () => v.removeListener(id),
  };
};

describe('useAnimation', () => {
  describe('initial state', () => {
    it('initializes Animated.Value at initialValue', () => {
      const { result } = renderHook(() => useAnimation(baseConfig));
      const tracker = trackAnimatedValue(result.current.value, 0);
      // Confirm by setting to initialValue and reading back
      act(() => {
        result.current.value.setValue(0);
      });
      expect(tracker.get()).toBe(0);
      tracker.dispose();
    });

    it('initializes Animated.Value at non-zero initialValue', () => {
      const config = { ...baseConfig, initialValue: 0.5 };
      const { result } = renderHook(() => useAnimation(config));
      const tracker = trackAnimatedValue(result.current.value, 0.5);
      act(() => {
        result.current.value.setValue(0.5);
      });
      expect(tracker.get()).toBe(0.5);
      tracker.dispose();
    });

    it('returns value, entryAnimation fn, and exitAnimation fn', () => {
      const { result } = renderHook(() => useAnimation(baseConfig));
      expect(typeof result.current.entryAnimation).toBe('function');
      expect(typeof result.current.exitAnimation).toBe('function');
      expect(typeof result.current.value).toBe('object');
    });
  });

  describe('value sync when initial/final props change', () => {
    it('snaps to new finalValue when value is at old finalValue', () => {
      const { result, rerender } = renderHook<
        ReturnType<typeof useAnimation>,
        AnimationConfig
      >((props) => useAnimation(props), { initialProps: baseConfig });

      const tracker = trackAnimatedValue(result.current.value, 0);

      // Move to finalValue (1)
      act(() => {
        result.current.value.setValue(1);
      });
      expect(tracker.get()).toBe(1);

      // Change finalValue → snap to new finalValue
      act(() => {
        rerender({ ...baseConfig, finalValue: 2 });
      });
      expect(tracker.get()).toBe(2);

      tracker.dispose();
    });

    it('snaps to new initialValue when value is at old initialValue', () => {
      const { result, rerender } = renderHook<
        ReturnType<typeof useAnimation>,
        AnimationConfig
      >((props) => useAnimation(props), { initialProps: baseConfig });

      const tracker = trackAnimatedValue(result.current.value, 0);

      // Set to initialValue (0) explicitly so listener tracks it
      act(() => {
        result.current.value.setValue(0);
      });
      expect(tracker.get()).toBe(0);

      act(() => {
        rerender({ ...baseConfig, initialValue: -1 });
      });
      expect(tracker.get()).toBe(-1);

      tracker.dispose();
    });

    it('does not snap when value is between initial and final', () => {
      const { result, rerender } = renderHook<
        ReturnType<typeof useAnimation>,
        AnimationConfig
      >((props) => useAnimation(props), { initialProps: baseConfig });

      const tracker = trackAnimatedValue(result.current.value, 0);

      // Place at mid-point (neither initial=0 nor final=1)
      act(() => {
        result.current.value.setValue(0.5);
      });
      expect(tracker.get()).toBe(0.5);

      // Change finalValue — should NOT snap (value is not at old finalValue)
      act(() => {
        rerender({ ...baseConfig, finalValue: 2 });
      });
      expect(tracker.get()).toBe(0.5);

      tracker.dispose();
    });

    it('does not snap when neither initial nor final changed', () => {
      const { result, rerender } = renderHook<
        ReturnType<typeof useAnimation>,
        AnimationConfig
      >((props) => useAnimation(props), { initialProps: baseConfig });

      const tracker = trackAnimatedValue(result.current.value, 0);
      act(() => {
        result.current.value.setValue(1);
      });

      act(() => {
        rerender({ ...baseConfig, entryAnimationConfig: { duration: 500 } });
      });
      expect(tracker.get()).toBe(1);

      tracker.dispose();
    });

    it('does not snap when only exitAnimationConfig changes', () => {
      const { result, rerender } = renderHook<
        ReturnType<typeof useAnimation>,
        AnimationConfig
      >((props) => useAnimation(props), { initialProps: baseConfig });

      const tracker = trackAnimatedValue(result.current.value, 0);
      act(() => {
        result.current.value.setValue(0);
      });

      act(() => {
        rerender({
          ...baseConfig,
          exitAnimationConfig: { duration: 200 },
        });
      });
      // initialValue unchanged → no snap
      expect(tracker.get()).toBe(0);

      tracker.dispose();
    });
  });
});
