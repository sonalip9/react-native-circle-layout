import { renderHook, act } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { rnAnimatedDriver } from '../../animation/rnAnimatedDriver';
import { useAnimatedSectorPath } from '../../hooks/useAnimatedSectorPath';
import { getSectorPath } from '../../utils/circle';

const center = { x: 50, y: 50 };
const startAngle = 0;

describe('useAnimatedSectorPath', () => {
  describe('static radius and endAngle', () => {
    it('returns the same path as getSectorPath', () => {
      const { result } = renderHook(() =>
        useAnimatedSectorPath({
          driver: rnAnimatedDriver,
          radius: 40,
          startAngle,
          endAngle: Math.PI / 2,
          center,
        })
      );

      expect(result.current).toBe(
        getSectorPath({ radius: 40, startAngle, endAngle: Math.PI / 2, center })
      );
    });
  });

  describe('only radius animated', () => {
    it('returns an animated interpolation node', () => {
      const radius = new Animated.Value(40);
      const { result } = renderHook(() =>
        useAnimatedSectorPath({
          driver: rnAnimatedDriver,
          radius,
          startAngle,
          endAngle: Math.PI / 2,
          center,
        })
      );

      expect(result.current?.constructor.name).toBe('AnimatedInterpolation');
    });
  });

  describe('only endAngle animated', () => {
    it('returns an animated interpolation node', () => {
      const endAngle = new Animated.Value(0);
      const { result } = renderHook(() =>
        useAnimatedSectorPath({
          driver: rnAnimatedDriver,
          radius: 40,
          startAngle,
          endAngle,
          center,
        })
      );

      expect(result.current?.constructor.name).toBe('AnimatedInterpolation');
    });
  });

  describe('both radius and endAngle animated', () => {
    it('starts as an empty string before any listener fires', () => {
      const radius = new Animated.Value(40);
      const endAngle = new Animated.Value(0);
      const { result } = renderHook(() =>
        useAnimatedSectorPath({
          driver: rnAnimatedDriver,
          radius,
          startAngle,
          endAngle,
          center,
        })
      );

      expect(result.current).toBe('');
    });

    it('recomputes the path from the latest radius and endAngle values', () => {
      const radius = new Animated.Value(40);
      const endAngle = new Animated.Value(0);
      const { result } = renderHook(() =>
        useAnimatedSectorPath({
          driver: rnAnimatedDriver,
          radius,
          startAngle,
          endAngle,
          center,
        })
      );

      act(() => {
        radius.setValue(60);
        endAngle.setValue(Math.PI / 2);
      });

      expect(result.current).toBe(
        getSectorPath({
          radius: 60,
          startAngle,
          endAngle: Math.PI / 2,
          center,
        })
      );
    });

    it('removes listeners on unmount', () => {
      const radius = new Animated.Value(40);
      const endAngle = new Animated.Value(0);
      const removeRadiusListener = jest.spyOn(radius, 'removeListener');
      const removeEndAngleListener = jest.spyOn(endAngle, 'removeListener');

      const { unmount } = renderHook(() =>
        useAnimatedSectorPath({
          driver: rnAnimatedDriver,
          radius,
          startAngle,
          endAngle,
          center,
        })
      );
      unmount();

      expect(removeRadiusListener).toHaveBeenCalledTimes(1);
      expect(removeEndAngleListener).toHaveBeenCalledTimes(1);
    });
  });
});
