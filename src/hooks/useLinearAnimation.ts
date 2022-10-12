import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type AnimationProps = Omit<
  Animated.TimingAnimationConfig,
  'toValue' | 'useNativeDriver'
>;

type ValueXY = { x: number; y: number };

/**
 * A hook that creates linear translation animation.
 * @param showComponent A flag to maintain whether the component is visible or not.
 * The change in value of this property triggers the entry or exit animation.
 * @param initialValue The start value of the animated value.
 * @param finalValue The end value of the animated value.
 * @param entryAnimationConfig The configuration for the entry animation.
 * @param exitAnimationConfig The configuration for the exit animation.
 * @returns The Animated Value on which the animation will be performed.
 */
export const useLinearAnimation = (
  showComponent: boolean,
  initialValue: ValueXY,
  finalValue: ValueXY,
  entryAnimationConfig: AnimationProps,
  exitAnimationConfig: AnimationProps = entryAnimationConfig
) => {
  const value = useRef(new Animated.ValueXY(initialValue)).current;

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
