import type { Animated } from 'react-native';

const withFunction = (callback: (value: number) => number) => {
  const inputRange: number[] = [];
  const outputRange: number[] = [];
  const steps = 50;
  for (let i = 0; i <= steps; i += 1) {
    const key = i / steps;
    inputRange.push(key);
    outputRange.push(callback(key));
  }
  return { inputRange, outputRange };
};

export const interpolationWithFunction = (
  value: Animated.Value,
  callback: (value: number) => number
) => value.interpolate(withFunction(callback));
