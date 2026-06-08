import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import type { AnimationConfig } from '../types';

interface AnimationArgs {
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
  entryAnimationConfig: AnimationConfig;
  /**
   * The configuration for the exit animation.
   */
  exitAnimationConfig?: AnimationConfig;
}

const EPSILON = 0.0001;

/**
 * A hook that creates entry and exit animations based on
 * the config.
 * @param props The configuration to create the animation.
 * @param props.initialValue The start value of the animated value.
 * @param props.finalValue The end value of the animated value.
 * @param props.entryAnimationConfig The configuration for the entry animation.
 * @param props.exitAnimationConfig The configuration for the exit animation.
 * @returns The an object containing the animated value on which
 * the animation will be performed, the entry and exit animation function.
 */
export const useAnimation = ({
  initialValue,
  finalValue,
  entryAnimationConfig,
  exitAnimationConfig = entryAnimationConfig,
}: AnimationArgs) => {
  const [value] = useState(() => new Animated.Value(initialValue));

  const currentValueRef = useRef(initialValue);
  const previousInitialValueRef = useRef(initialValue);
  const previousFinalValueRef = useRef(finalValue);

  // Keep track of the current animated value.
  useEffect(() => {
    const listenerId = value.addListener(({ value: currentValue }) => {
      currentValueRef.current = currentValue;
    });

    return () => {
      value.removeListener(listenerId);
    };
  }, [value]);

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
      value.setValue(finalValue);
    } else if (isAtPreviousInitial && initialChanged) {
      value.setValue(initialValue);
    }

    previousInitialValueRef.current = initialValue;
    previousFinalValueRef.current = finalValue;
  }, [initialValue, finalValue, value]);

  /**
   * Function to create a fade-in entry animation.
   */
  const entryAnimation = useCallback(
    () =>
      Animated.timing(value, {
        useNativeDriver: false,
        toValue: finalValue,
        ...entryAnimationConfig,
      }),
    [entryAnimationConfig, finalValue, value]
  );

  /**
   * Function to create a fade-out exit animation.
   */
  const exitAnimation = useCallback(
    () =>
      Animated.timing(value, {
        useNativeDriver: false,
        toValue: initialValue,
        ...exitAnimationConfig,
      }),
    [exitAnimationConfig, initialValue, value]
  );

  return { value, entryAnimation, exitAnimation };
};
