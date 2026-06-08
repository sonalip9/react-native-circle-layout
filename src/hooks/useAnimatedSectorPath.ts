import { Animated } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getSectorPath, interpolationWithFunction } from '../utils';

type UseAnimatedSectorPath = {
  /**
   * The radius of the sector. Can be a static number or an animated value.
   */
  radius: Animated.Value | number;
  /**
   * The angle at which the sector starts, in radians.
   */
  startAngle: number;
  /**
   * The angle at which the sector ends. Can be a static number or an animated value.
   */
  endAngle: Animated.Value | number;
  /**
   * The center point of the circle on which the sector is drawn.
   */
  center: { x: number; y: number };
};

/**
 * Derives the SVG path for an animated sector from a (possibly animated)
 * radius and end angle.
 *
 * `Animated.Value` only accepts numeric values, so a path string can't be
 * driven by a single animated node. When only one of `radius`/`endAngle` is
 * animated (or neither is), the path is a pure derivation of the current
 * props and is computed via `interpolationWithFunction`/`getSectorPath` in
 * `useMemo`, staying on the native-driven interpolation path where possible.
 * When BOTH are animated, the two values tick independently, so the path is
 * recomputed from listeners that track the latest known numbers in refs
 * (avoiding stale closures) and is surfaced via React state, updated only
 * from those listener callbacks (an external system subscription), never
 * synchronously within the effect body.
 * @param props The properties for deriving the animated sector path.
 * @param props.radius The radius of the sector. Can be a static number or an animated value.
 * @param props.startAngle The angle at which the sector starts, in radians.
 * @param props.endAngle The angle at which the sector ends. Can be a static number or an animated value.
 * @param props.center The center point of the circle on which the sector is drawn.
 * @returns The animated (or static) SVG path for the sector.
 */
export const useAnimatedSectorPath = ({
  radius,
  startAngle,
  endAngle,
  center,
}: UseAnimatedSectorPath) => {
  const bothAnimated =
    radius instanceof Animated.Value && endAngle instanceof Animated.Value;

  const derivedPath = useMemo<
    Animated.AnimatedInterpolation<string> | string | undefined
  >(() => {
    if (bothAnimated) return undefined;

    if (radius instanceof Animated.Value) {
      return interpolationWithFunction(radius, (s) =>
        getSectorPath({
          radius: s,
          startAngle,
          endAngle: endAngle as number,
          center,
        })
      );
    }

    if (endAngle instanceof Animated.Value) {
      return interpolationWithFunction(
        endAngle,
        (r) => getSectorPath({ radius, startAngle, endAngle: r, center }),
        { endValue: Math.PI * 2 }
      );
    }

    return getSectorPath({ radius, startAngle, endAngle, center });
  }, [bothAnimated, radius, endAngle, startAngle, center]);

  const [listenerPath, setListenerPath] = useState('');
  const currentRadiusRef = useRef(0);
  const currentEndAngleRef = useRef(0);

  useEffect(() => {
    if (!bothAnimated) return;

    const animatedRadius = radius as Animated.Value;
    const animatedEndAngle = endAngle as Animated.Value;

    const recalculatePath = () => {
      setListenerPath(
        getSectorPath({
          radius: currentRadiusRef.current,
          startAngle,
          endAngle: currentEndAngleRef.current,
          center,
        })
      );
    };

    const radiusListenerId = animatedRadius.addListener(({ value }) => {
      currentRadiusRef.current = value;
      recalculatePath();
    });
    const endAngleListenerId = animatedEndAngle.addListener(({ value }) => {
      currentEndAngleRef.current = value;
      recalculatePath();
    });

    return () => {
      animatedRadius.removeListener(radiusListenerId);
      animatedEndAngle.removeListener(endAngleListenerId);
    };
  }, [bothAnimated, radius, endAngle, startAngle, center]);

  return bothAnimated ? listenerPath : (derivedPath ?? '');
};
