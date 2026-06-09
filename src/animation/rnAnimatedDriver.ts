import { Animated } from 'react-native';

import { withFunction } from '../utils/animation';

import type { AnimationDriver } from './types';

/**
 * The driver-specific timing configuration for {@link rnAnimatedDriver}.
 * @see https://reactnative.dev/docs/animated#timing
 */
export type RNAnimationConfig = Omit<
  Animated.TimingAnimationConfig,
  'toValue' | 'useNativeDriver'
>;

/**
 * The default {@link AnimationDriver}, backed by React Native's core
 * `Animated` API. Used when no `animationDriver` prop is passed to
 * `CircleLayout`.
 */
export const rnAnimatedDriver: AnimationDriver<
  Animated.Value,
  Animated.AnimatedInterpolation<number | string>,
  Animated.CompositeAnimation,
  RNAnimationConfig
> = {
  createValue: (initialValue) => new Animated.Value(initialValue),

  setValue: (value, newValue) => value.setValue(newValue),

  addValueListener: (value, callback) => {
    const listenerId = value.addListener(({ value: currentValue }) =>
      callback(currentValue)
    );

    return () => value.removeListener(listenerId);
  },

  timing: (value, toValue, config) =>
    Animated.timing(value, { useNativeDriver: true, toValue, ...config }),

  sequence: (animations) => Animated.sequence(animations),

  parallel: (animations) => Animated.parallel(animations),

  delay: (durationMs) => Animated.delay(durationMs),

  start: (animation, onComplete) => animation.start(onComplete),

  multiply: (a, b) =>
    Animated.multiply(
      a as Animated.Value | Animated.AnimatedInterpolation<number> | number,
      b as Animated.Value | Animated.AnimatedInterpolation<number> | number
    ),

  subtract: (a, b) =>
    Animated.subtract(
      a as Animated.Value | Animated.AnimatedInterpolation<number> | number,
      b as Animated.Value | Animated.AnimatedInterpolation<number> | number
    ),

  interpolate: (value, callback, config) =>
    (value as Animated.Value).interpolate(withFunction(callback, config)),

  isAnimatedValue: (value): value is Animated.Value =>
    value instanceof Animated.Value,

  createAnimatedComponent: (Component) =>
    Animated.createAnimatedComponent(Component) as typeof Component,
};
