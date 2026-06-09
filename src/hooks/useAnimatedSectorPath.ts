import { useEffect, useMemo, useRef, useState } from 'react';

import type { AnimatedNode, AnimationDriver } from '../animation/types';
import { getSectorPath } from '../utils';

type UseAnimatedSectorPath<D extends AnimationDriver> = {
  /**
   * The driver used to power the animated interpolations.
   */
  driver: D;
  /**
   * The radius of the sector. Can be a static number or an animated node.
   */
  radius: AnimatedNode<D> | number;
  /**
   * The angle at which the sector starts, in radians.
   */
  startAngle: number;
  /**
   * The angle at which the sector ends. Can be a static number or an animated node.
   */
  endAngle: AnimatedNode<D> | number;
  /**
   * The center point of the circle on which the sector is drawn.
   */
  center: { x: number; y: number };
};

/**
 * Derives the SVG path for an animated sector from a (possibly animated)
 * radius and end angle.
 *
 * Animated numeric nodes only carry numbers, so a path string can't be
 * driven by a single animated node. When only one of `radius`/`endAngle` is
 * animated (or neither is), the path is a pure derivation of the current
 * props and is computed via `driver.interpolate`/`getSectorPath` in
 * `useMemo`, staying on the driver's native-driven interpolation path where
 * possible. When BOTH are animated, the two values tick independently, so
 * the path is recomputed from listeners that track the latest known numbers
 * in refs (avoiding stale closures) and is surfaced via React state, updated
 * only from those listener callbacks (an external system subscription),
 * never synchronously within the effect body.
 * @param props The properties for deriving the animated sector path.
 * @param props.driver The driver used to power the animated interpolations.
 * @param props.radius The radius of the sector. Can be a static number or an animated node.
 * @param props.startAngle The angle at which the sector starts, in radians.
 * @param props.endAngle The angle at which the sector ends. Can be a static number or an animated node.
 * @param props.center The center point of the circle on which the sector is drawn.
 * @returns The animated (or static) SVG path for the sector.
 */
export const useAnimatedSectorPath = <D extends AnimationDriver>({
  driver,
  radius,
  startAngle,
  endAngle,
  center,
}: UseAnimatedSectorPath<D>) => {
  const bothAnimated =
    driver.isAnimatedValue(radius) && driver.isAnimatedValue(endAngle);

  const derivedPath = useMemo<AnimatedNode<D> | string | undefined>(() => {
    if (bothAnimated) return undefined;

    if (driver.isAnimatedValue(radius)) {
      return driver.interpolate(radius, (s) =>
        getSectorPath({
          radius: s,
          startAngle,
          endAngle: endAngle as number,
          center,
        })
      ) as AnimatedNode<D>;
    }

    if (driver.isAnimatedValue(endAngle)) {
      return driver.interpolate(
        endAngle,
        (r) => getSectorPath({ radius, startAngle, endAngle: r, center }),
        { endValue: Math.PI * 2 }
      ) as AnimatedNode<D>;
    }

    return getSectorPath({ radius, startAngle, endAngle, center });
  }, [bothAnimated, driver, radius, endAngle, startAngle, center]);

  const [listenerPath, setListenerPath] = useState('');
  const currentRadiusRef = useRef(0);
  const currentEndAngleRef = useRef(0);

  useEffect(() => {
    if (!bothAnimated) return;

    const animatedRadius = radius as Parameters<
      typeof driver.addValueListener
    >[0];
    const animatedEndAngle = endAngle as Parameters<
      typeof driver.addValueListener
    >[0];

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

    const removeRadiusListener = driver.addValueListener(
      animatedRadius,
      (value) => {
        currentRadiusRef.current = value;
        recalculatePath();
      }
    );
    const removeEndAngleListener = driver.addValueListener(
      animatedEndAngle,
      (value) => {
        currentEndAngleRef.current = value;
        recalculatePath();
      }
    );

    return () => {
      removeRadiusListener();
      removeEndAngleListener();
    };
  }, [bothAnimated, driver, radius, endAngle, startAngle, center]);

  return bothAnimated ? listenerPath : (derivedPath ?? '');
};
