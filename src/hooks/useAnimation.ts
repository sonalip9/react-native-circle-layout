import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type AnimationProps = Omit<
  Animated.TimingAnimationConfig,
  'toValue' | 'useNativeDriver'
>;

/**
 * A hook that creates fade-in entry animation and fade-out exit animation.
 * @param showComponent A flag to maintain whether the component is visible or not.
 * The change in value of this property triggers the entry or exit animation.
 * @param entryAnimationConfig The configuration for the entry animation.
 * @param exitAnimationConfig The configuration for the exit animation.
 * @param initialValue The initialValue of the animated value.
 * @returns The Animated Value on which the animation will be performed.
 */
export const useAnimation = (
  showComponent: boolean,
  entryAnimationConfig: AnimationProps,
  exitAnimationConfig: AnimationProps = entryAnimationConfig,
  initialValue = 0
) => {
  const value = useRef(new Animated.Value(initialValue)).current;

  /**
   * Function to create a fade-in entry animation.
   */
  const entryAnimation = useCallback(
    () =>
      Animated.timing(value, {
        useNativeDriver: true,
        toValue: 1,
        ...exitAnimationConfig,
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
        toValue: 0,
        ...entryAnimationConfig,
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
      value.setValue(0);
      inAnimation.start();
    } else {
      value.setValue(1);
      outAnimation.start();
    }
    return () => {
      inAnimation.stop();
      outAnimation.stop();
    };
  }, [showComponent]);

  return value;
};
