import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { AnimatedNode, AnimationDriver } from '../animation/types';
import { getDonutSectorPath, getSectorPath } from '../utils';

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
  /**
   * When provided and > 0, the path describes an annular sector (donut slice)
   * instead of a full sector pie slice.
   */
  innerRadius?: number;
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
 * @param props.innerRadius When provided and > 0, the path describes an annular sector (donut slice) instead of a full sector pie slice.
 * @returns The animated (or static) SVG path for the sector.
 */
export const useAnimatedSectorPath = <D extends AnimationDriver>({
  driver,
  radius,
  startAngle,
  endAngle,
  center,
  innerRadius,
}: UseAnimatedSectorPath<D>): AnimatedNode<D> | string => {
  const buildPath = useCallback(
    (r: number, a: number) =>
      innerRadius && innerRadius > 0
        ? getDonutSectorPath({
            radius: r,
            innerRadius,
            startAngle,
            endAngle: a,
            center,
          })
        : getSectorPath({ radius: r, startAngle, endAngle: a, center }),
    [innerRadius, startAngle, center]
  );
  const radiusIsNumber = typeof radius === 'number';
  const endAngleIsNumber = typeof endAngle === 'number';
  const bothListenable =
    driver.isAnimatedValue(radius) && driver.isAnimatedValue(endAngle);

  const derivedPath = useMemo<AnimatedNode<D> | string | undefined>(() => {
    if (bothListenable) return undefined;

    if (!radiusIsNumber && endAngleIsNumber) {
      return driver.interpolate(radius, (s) =>
        buildPath(s, endAngle)
      ) as AnimatedNode<D>;
    }

    if (radiusIsNumber && !endAngleIsNumber) {
      return driver.interpolate(endAngle, (a) => buildPath(radius, a), {
        endValue: Math.PI * 2,
      }) as AnimatedNode<D>;
    }

    if (!radiusIsNumber || !endAngleIsNumber) {
      // Both are animated nodes but neither pair is fully listenable —
      // addValueListener only supports TValue, so we can't drive a path
      // from two derived nodes simultaneously.
      return undefined;
    }

    return buildPath(radius, endAngle);
  }, [
    bothListenable,
    radiusIsNumber,
    endAngleIsNumber,
    driver,
    radius,
    endAngle,
    buildPath,
  ]);

  const [listenerPath, setListenerPath] = useState('');
  const currentRadiusRef = useRef(0);
  const currentEndAngleRef = useRef(0);

  useEffect(() => {
    if (!bothListenable) return;

    const animatedRadius = radius;
    const animatedEndAngle = endAngle;

    const recalculatePath = () => {
      setListenerPath(
        buildPath(currentRadiusRef.current, currentEndAngleRef.current)
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
  }, [bothListenable, driver, radius, endAngle, startAngle, center, buildPath]);

  return bothListenable ? listenerPath : (derivedPath ?? '');
};
