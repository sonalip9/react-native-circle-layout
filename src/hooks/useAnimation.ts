import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  AnimationDriver,
  DriverComposite,
  DriverConfig,
  DriverValue,
} from '../animation/types';

interface AnimationArgs<D extends AnimationDriver> {
  /**
   * The driver used to power the animation.
   */
  driver: D;
  /**
   * The start value of the animated value.
   */
  initialValue: number;
  /**
   * The end value of the animated value.
   */
  finalValue: number;
  /**
   * The configuration for the entry animation.
   */
  entryAnimationConfig: DriverConfig<D>;
  /**
   * The configuration for the exit animation.
   * Defaults to the entry animation config if not provided.
   */
  exitAnimationConfig?: DriverConfig<D>;
}

const EPSILON = 0.0001;

/**
 * A hook that creates entry and exit animations based on
 * the config.
 * @param props The configuration to create the animation.
 * @param props.driver The driver used to power the animation.
 * @param props.initialValue The start value of the animated value.
 * @param props.finalValue The end value of the animated value.
 * @param props.entryAnimationConfig The configuration for the entry animation.
 * @param props.exitAnimationConfig The configuration for the exit animation.
 * @returns The an object containing the animated value on which
 * the animation will be performed, the entry and exit animation function.
 */
export const useAnimation = <D extends AnimationDriver>({
  driver,
  initialValue,
  finalValue,
  entryAnimationConfig,
  exitAnimationConfig = entryAnimationConfig,
}: AnimationArgs<D>) => {
  const [value] = useState(
    () => driver.createValue(initialValue) as DriverValue<D>
  );

  const currentValueRef = useRef(initialValue);
  const previousInitialValueRef = useRef(initialValue);
  const previousFinalValueRef = useRef(finalValue);

  // Keep track of the current animated value.
  useEffect(() => {
    return driver.addValueListener(value, (currentValue) => {
      currentValueRef.current = currentValue;
    });
  }, [driver, value]);

  useEffect(() => {
    const previousInitialValue = previousInitialValueRef.current;
    const previousFinalValue = previousFinalValueRef.current;

    const currentValue = currentValueRef.current;

    const isAtPreviousInitial =
      Math.abs(currentValue - previousInitialValue) < EPSILON;

    const isAtPreviousFinal =
      Math.abs(currentValue - previousFinalValue) < EPSILON;

    const initialChanged = initialValue !== previousInitialValue;
    const finalChanged = finalValue !== previousFinalValue;

    if (isAtPreviousFinal && finalChanged) {
      driver.setValue(value, finalValue);
    } else if (isAtPreviousInitial && initialChanged) {
      driver.setValue(value, initialValue);
    }

    previousInitialValueRef.current = initialValue;
    previousFinalValueRef.current = finalValue;
  }, [driver, initialValue, finalValue, value]);

  /**
   * Function to create a fade-in entry animation.
   */
  const entryAnimation = useCallback(
    () =>
      driver.timing(
        value,
        finalValue,
        entryAnimationConfig
      ) as DriverComposite<D>,
    [driver, entryAnimationConfig, finalValue, value]
  );

  /**
   * Function to create a fade-out exit animation.
   */
  const exitAnimation = useCallback(
    () =>
      driver.timing(
        value,
        initialValue,
        exitAnimationConfig
      ) as DriverComposite<D>,
    [driver, exitAnimationConfig, initialValue, value]
  );

  return { value, entryAnimation, exitAnimation };
};
