import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

type AnimationProps = Omit<
  Animated.TimingAnimationConfig,
  'toValue' | 'useNativeDriver'
>;

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
  entryAnimationConfig: AnimationProps;
  /**
   * The configuration for the exit animation.
   */
  exitAnimationConfig: AnimationProps;
}

/**
 * A hook that creates linear translation animation.
 * @params props The configuration to create the animation.
 * @returns The Animated Value on which the animation will be performed.
 */
export const useAnimation = ({
  initialValue,
  finalValue,
  entryAnimationConfig,
  exitAnimationConfig = entryAnimationConfig,
}: AnimationArgs) => {
  const value = useRef(new Animated.Value(initialValue)).current;

  /**
   * Function to create a fade-in entry animation.
   */
  const entryAnimation = useCallback(
    () =>
      Animated.timing(value, {
        useNativeDriver: true,
        toValue: finalValue,
        ...entryAnimationConfig,
      }),
    []
  );

  /**
   * Function to create a fade-out exit animation.
   */
  const exitAnimation = useCallback(
    () =>
      Animated.timing(value, {
        useNativeDriver: true,
        toValue: initialValue,
        ...exitAnimationConfig,
      }),
    []
  );

  return { value, entryAnimation, exitAnimation };
};
