import { act, renderHook } from '@testing-library/react-native';

import { rnAnimatedDriver } from '../../animation/rnAnimatedDriver';
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
  sectorAngles: Array(3).fill((2 * Math.PI) / 3),
  componentAngles: [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3],
  animationDriver: rnAnimatedDriver,
};

describe('useCombinedAnimation', () => {
  describe('without animation props', () => {
    it('returns static radius from context when no LINEAR config', async () => {
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(result.current.radiusValue).toBe(100);
    });

    it('returns static radians prop when no CIRCULAR config', async () => {
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 1, radians: Math.PI / 2 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(result.current.radiansValue).toBe(Math.PI / 2);
    });

    it('returns opacity 1 when no OPACITY config', async () => {
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(result.current.opacityValue).toBe(1);
    });

    it('exposes showComponent and hideComponent functions', async () => {
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(typeof result.current.showComponent).toBe('function');
      expect(typeof result.current.hideComponent).toBe('function');
    });

    it('showComponent and hideComponent are no-ops without animationProps', async () => {
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(baseContext) }
      );
      await expect(
        (async () => {
          await act(() => {
            result.current.hideComponent();
          });
          await act(() => {
            result.current.showComponent();
          });
        })()
      ).resolves.not.toThrow();
    });
  });

  describe('with opacity animation config', () => {
    const ctxWithOpacity: CircleLayoutContextType = {
      ...baseContext,
      animationProps: {
        animationConfigs: {
          [AnimationType.OPACITY]: { duration: 300 },
        },
        animationCombinationType: AnimationCombinationType.PARALLEL,
      },
    };

    it('returns Animated.Value for opacity when OPACITY config provided', async () => {
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(ctxWithOpacity) }
      );
      // opacityValue should be an Animated value (object), not a plain number
      expect(typeof result.current.opacityValue).toBe('object');
    });

    it('showComponent and hideComponent run OPACITY animation without throwing', async () => {
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(ctxWithOpacity) }
      );
      await expect(
        (async () => {
          await act(() => {
            result.current.hideComponent();
          });
          await act(() => {
            result.current.showComponent();
          });
        })()
      ).resolves.not.toThrow();
    });
  });

  describe('with linear animation config', () => {
    const ctxWithLinear: CircleLayoutContextType = {
      ...baseContext,
      animationProps: {
        animationConfigs: {
          [AnimationType.LINEAR]: { duration: 300 },
        },
        animationCombinationType: AnimationCombinationType.PARALLEL,
      },
    };

    it('returns Animated.Value for radius when LINEAR config provided', async () => {
      const { result } = await renderHook(
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
        animationConfigs: {
          [AnimationType.CIRCULAR]: { duration: 300 },
        },
        animationCombinationType: AnimationCombinationType.PARALLEL,
      },
    };

    it('returns Animated.Value for radians when CIRCULAR config provided', async () => {
      const { result } = await renderHook(
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
        animationConfigs: {
          [AnimationType.OPACITY]: { duration: 200 },
        },
        animationCombinationType: AnimationCombinationType.SEQUENCE,
        animationGap: 50,
      },
    };

    it('showComponent and hideComponent run animations in SEQUENCE without throwing', async () => {
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(ctxWithSequence) }
      );
      await expect(
        (async () => {
          await act(() => {
            result.current.hideComponent();
          });
          await act(() => {
            result.current.showComponent();
          });
        })()
      ).resolves.not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('handles empty animationConfigs object without throwing', async () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: {},
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(ctx) }
      );
      await expect(
        (async () => {
          await act(() => {
            result.current.hideComponent();
          });
          await act(() => {
            result.current.showComponent();
          });
        })()
      ).resolves.not.toThrow();
    });

    it('handles radians > 2π with CIRCULAR animation without throwing', async () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: {
            [AnimationType.CIRCULAR]: { duration: 300 },
          },
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };
      await expect(
        (async () => {
          await renderHook(
            () => useCombinedAnimation({ index: 0, radians: 3 * Math.PI }),
            { wrapper: makeWrapper(ctx) }
          );
        })()
      ).resolves.not.toThrow();
    });

    it('animationGap of 0 in SEQUENCE produces zero delay without throwing', async () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: {
            [AnimationType.OPACITY]: { duration: 300 },
          },
          animationCombinationType: AnimationCombinationType.SEQUENCE,
          animationGap: 0,
        },
      };
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(ctx) }
      );
      await expect(
        (async () => {
          await act(() => {
            result.current.hideComponent();
          });
          await act(() => {
            result.current.showComponent();
          });
        })()
      ).resolves.not.toThrow();
    });

    it('returns opacity 1 when no OPACITY config and component is visible', async () => {
      // No animationProps → componentVisible drives opacityValue
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 0, radians: 0 }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(result.current.opacityValue).toBe(1);
    });

    it('handles large index with SEQUENCE (large staggered delay) without throwing', async () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: {
            [AnimationType.OPACITY]: { duration: 100 },
          },
          animationCombinationType: AnimationCombinationType.SEQUENCE,
          animationGap: 50,
        },
      };
      jest.useFakeTimers();
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 999, radians: 0 }),
        { wrapper: makeWrapper(ctx) }
      );
      await expect(
        (async () => {
          await act(() => {
            result.current.showComponent();
          });
          await act(() => {
            result.current.hideComponent();
          });
          await act(() => {
            jest.runOnlyPendingTimers();
          });
        })()
      ).resolves.not.toThrow();
      jest.useRealTimers();
    });

    it('returns static values when no animationProps provided with non-zero radians', async () => {
      const { result } = await renderHook(
        () => useCombinedAnimation({ index: 2, radians: Math.PI }),
        { wrapper: makeWrapper(baseContext) }
      );
      expect(result.current.radiusValue).toBe(100);
      expect(result.current.radiansValue).toBe(Math.PI);
      expect(result.current.opacityValue).toBe(1);
    });
  });
});
