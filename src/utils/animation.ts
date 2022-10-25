import type { Animated } from 'react-native';

type InterpolationConfig = {
  /**
   * The start value of the input range.
   */
  startValue?: number;
  /**
   * The end value of the input range.
   */
  endValue?: number;
  /**
   * The number of iterations to perform.
   */
  totalIterations?: number;
};

/**
 * Creates an input and output range based on the logic of the callback function.
 * @param callback The function used to create the output range for the interpolation.
 * @param interpolationConfig The configuration for the input range and the iterations to perform.
 * @returns The object containing the inputRange and the outputRange for the interpolation
 */
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

/**
 * Interpolates the value before updating the property using the callback function.
 * @param value The animated value that needs to be interpolated.
 * @param callback The function to use to create an output range by interpolating
 * the input range values.
 * @param interpolationConfig The configuration to be passed to the callback function.
 * @param animatedInterpolationConfig The configuration for the animated interpolation.
 * @returns Animated Interpolation value
 */
export const interpolationWithFunction = (
  value: Animated.Value,
  callback: (value: number) => number,
  interpolationConfig?: InterpolationConfig,
  animatedInterpolationConfig?: Omit<
    Animated.InterpolationConfigType,
    'inputRange' | 'outputRange'
  >
) =>
  value.interpolate({
    ...withFunction(callback, interpolationConfig),
    ...animatedInterpolationConfig,
  });
