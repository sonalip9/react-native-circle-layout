import { useCallback, useState } from 'react';
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
  exitAnimationConfig?: AnimationProps;
}

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
    [entryAnimationConfig, finalValue, value]
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
    [exitAnimationConfig, initialValue, value]
  );

  return { value, entryAnimation, exitAnimation };
};
