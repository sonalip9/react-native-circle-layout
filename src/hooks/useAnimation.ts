import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type AnimationProps = Omit<
  Animated.TimingAnimationConfig,
  'toValue' | 'useNativeDriver'
>;

interface AnimationArgs {
  /**
   * A flag to maintain whether the component is visible or not.
   * The change in value of this property triggers the entry or exit animation.
   */
  showComponent: boolean;
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
 * @returns The Animated Value on which the animation will be performed.
 */
export const useAnimation = ({
  showComponent,
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

  /**
   * This hook performs entry and exit animation depending on the state of the
   * showComponent flag.
   */
  useEffect(() => {
    const inAnimation = entryAnimation();
    const outAnimation = exitAnimation();

    if (showComponent) {
      value.setValue(initialValue);
      inAnimation.start();
    } else {
      value.setValue(finalValue);
      outAnimation.start();
    }
    return () => {
      inAnimation.stop();
      outAnimation.stop();
    };
  }, [showComponent]);

  return value;
};
