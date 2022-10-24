import type { Animated } from 'react-native';

type InterpolationConfig = {
  startValue?: number;
  endValue?: number;
  totalIterations?: number;
};

const withFunction = (
  callback: (value: number) => number,
  interpolationConfig?: InterpolationConfig
) => {
  const {
    startValue = 0,
    endValue = 1,
    totalIterations = 50,
  } = interpolationConfig ?? {
    startValue: 0,
    endValue: 1,
    totalIterations: 50,
  };
  const inputRange: number[] = [];
  const outputRange: number[] = [];
  const step = (endValue - startValue) / totalIterations;
  for (let i = startValue; i <= totalIterations; i += 1) {
    const key = startValue + step * i;
    inputRange.push(key);
    outputRange.push(callback(key));
  }
  return { inputRange, outputRange };
};

export const interpolationWithFunction = (
  value: Animated.Value,
  callback: (value: number) => number,
  interpolationConfig?: InterpolationConfig
) => value.interpolate(withFunction(callback, interpolationConfig));
