import { renderHook } from '@testing-library/react-native';

import { CircleLayoutContext } from '../../CircleLayoutContext';
import { useCombinedAnimation } from '../../hooks/useCombinedAnimation';
import {
  AnimationCombinationType,
  AnimationType,
  type CircleLayoutContextType,
} from '../../types';

const makeWrapper =
  (ctx: CircleLayoutContextType) =>
  ({ children }: { children: React.ReactNode }) => (
    <CircleLayoutContext value={ctx}>{children}</CircleLayoutContext>
  );

const baseContext: CircleLayoutContextType = {
  totalParts: 3,
  radius: 100,
  startAngle: 0,
};

describe('useCombinedAnimation', () => {
  describe('without animation props', () => {
    it('returns static radius from context when no LINEAR config', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(result.current.radiusValue).toBe(100);
    });

    it('returns static radians prop when no CIRCULAR config', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 1, radians: Math.PI / 2 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(result.current.radiansValue).toBe(Math.PI / 2);
    });

    it('returns opacity 1 when no OPACITY config', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(result.current.opacityValue).toBe(1);
    });

    it('exposes showComponent and hideComponent functions', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(typeof result.current.showComponent).toBe('function');
      expect(typeof result.current.hideComponent).toBe('function');
    });

    it('showComponent and hideComponent are no-ops without animationProps', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(() => {
        result.current.hideComponent();
        result.current.showComponent();
      }).not.toThrow();
    });
  });

  describe('with opacity animation config', () => {
    const ctxWithOpacity: CircleLayoutContextType = {
      ...baseContext,
      animationProps: {
        animationConfigs: [
          { type: AnimationType.OPACITY, config: { duration: 300 } },
        ],
        animationCombinationType: AnimationCombinationType.PARALLEL,
      },
    };

    it('returns Animated.Value for opacity when OPACITY config provided', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(ctxWithOpacity) }
      );
      // opacityValue should be an Animated value (object), not a plain number
      expect(typeof result.current.opacityValue).toBe('object');
    });

    it('showComponent and hideComponent run OPACITY animation without throwing', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(ctxWithOpacity) }
      );
      expect(() => {
        result.current.hideComponent();
        result.current.showComponent();
      }).not.toThrow();
    });
  });

  describe('with linear animation config', () => {
    const ctxWithLinear: CircleLayoutContextType = {
      ...baseContext,
      animationProps: {
        animationConfigs: [
          { type: AnimationType.LINEAR, config: { duration: 300 } },
        ],
        animationCombinationType: AnimationCombinationType.PARALLEL,
      },
    };

    it('returns Animated.Value for radius when LINEAR config provided', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(ctxWithLinear) }
      );
      expect(typeof result.current.radiusValue).toBe('object');
    });
  });

  describe('with circular animation config', () => {
    const ctxWithCircular: CircleLayoutContextType = {
      ...baseContext,
      animationProps: {
        animationConfigs: [
          { type: AnimationType.CIRCULAR, config: { duration: 300 } },
        ],
        animationCombinationType: AnimationCombinationType.PARALLEL,
      },
    };

    it('returns Animated.Value for radians when CIRCULAR config provided', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 0, radians: Math.PI }),
        { wrapper: makeWrapper(ctxWithCircular) }
      );
      expect(typeof result.current.radiansValue).toBe('object');
    });
  });

  describe('with sequence combination type', () => {
    const ctxWithSequence: CircleLayoutContextType = {
      ...baseContext,
      animationProps: {
        animationConfigs: [
          { type: AnimationType.OPACITY, config: { duration: 200 } },
        ],
        animationCombinationType: AnimationCombinationType.SEQUENCE,
        animationGap: 50,
      },
    };

    it('showComponent and hideComponent run animations in SEQUENCE without throwing', () => {
      const { result } = renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(ctxWithSequence) }
      );
      expect(() => {
        result.current.hideComponent();
        result.current.showComponent();
      }).not.toThrow();
    });
  });
});
