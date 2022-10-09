import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type AnimationProps = Omit<
  Animated.TimingAnimationConfig,
  'toValue' | 'useNativeDriver'
>;

export const useAnimation = (
  showComponent: boolean,
  entryAnimationConfig: AnimationProps,
  exitAnimationConfig: AnimationProps = entryAnimationConfig,
  initialValue: number = 0
) => {
  const value = useRef(new Animated.Value(initialValue)).current;

  /**
   * Function to create a fade-in animation.
   */
  const entryAnimation = useCallback(() => {
    return Animated.timing(value, {
      useNativeDriver: true,
      toValue: 1,
      ...exitAnimationConfig,
    });
  }, []);

  /**
   * Function to create a fade-out animation.
   */
  const exitAnimation = useCallback(() => {
    return Animated.timing(value, {
      useNativeDriver: true,
      toValue: 0,
      ...entryAnimationConfig,
    });
  }, []);

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
