import { withFunction } from '../utils/animation';

describe('withFunction', () => {
  it('should generate inputRange and outputRange arrays based on the provided callback and interpolationConfig', () => {
    const callback = (value: number) => value * 2;
    const interpolationConfig = {
      startValue: 0,
      endValue: 10,
      totalIterations: 5,
    };

    const result = withFunction(callback, interpolationConfig);

    expect(result.inputRange).toEqual([0, 2, 4, 6, 8, 10]);
    expect(result.outputRange).toEqual([0, 4, 8, 12, 16, 20]);
  });

  it('should use default interpolationConfig if not provided', () => {
    const callback = (value: number) => value * 2;

    const result = withFunction(callback);

    expect(result.inputRange).toEqual([
      0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2, 0.22, 0.24,
      0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.4, 0.42, 0.44, 0.46, 0.48, 0.5,
      0.52, 0.54, 0.56, 0.58, 0.6, 0.62, 0.64, 0.66, 0.68, 0.7, 0.72, 0.74,
      0.76, 0.78, 0.8, 0.82, 0.84, 0.86, 0.88, 0.9, 0.92, 0.94, 0.96, 0.98, 1,
    ]);
    expect(result.outputRange).toEqual([
      0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.24, 0.28, 0.32, 0.36, 0.4, 0.44, 0.48,
      0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.76, 0.8, 0.84, 0.88, 0.92, 0.96, 1,
      1.04, 1.08, 1.12, 1.16, 1.2, 1.24, 1.28, 1.32, 1.36, 1.4, 1.44, 1.48,
      1.52, 1.56, 1.6, 1.64, 1.68, 1.72, 1.76, 1.8, 1.84, 1.88, 1.92, 1.96, 2,
    ]);
  });

  it('should return empty arrays if totalIterations is 0', () => {
    const callback = (value: number) => value * 2;
    const interpolationConfig = {
      startValue: 0,
      endValue: 10,
      totalIterations: 0,
    };

    const result = withFunction(callback, interpolationConfig);

    expect(result.inputRange).toEqual([]);
    expect(result.outputRange).toEqual([]);
  });

  it('should generate descending inputRange and outputRange arrays when startValue is greater than endValue', () => {
    const callback = (value: number) => value * 2;
    const interpolationConfig = {
      startValue: 10,
      endValue: 0,
      totalIterations: 5,
    };

    const result = withFunction(callback, interpolationConfig);

    expect(result.inputRange).toEqual([10, 8, 6, 4, 2, 0]);
    expect(result.outputRange).toEqual([20, 16, 12, 8, 4, 0]);
  });

  it('should throw an error if totalIterations is negative', () => {
    const callback = (value: number) => value * 2;
    const interpolationConfig = {
      startValue: 0,
      endValue: 10,
      totalIterations: -5,
    };

    expect(() => withFunction(callback, interpolationConfig)).toThrowError(
      new Error('totalIterations cannot be negative')
    );
  });

  it('should generate inputRange and outputRange arrays when startValue is negative and endValue is positive', () => {
    const callback = (value: number) => value * 2;
    const interpolationConfig = {
      startValue: -10,
      endValue: 10,
      totalIterations: 5,
    };

    const result = withFunction(callback, interpolationConfig);

    expect(result.inputRange).toEqual([-10, -6, -2, 2, 6, 10]);
    expect(result.outputRange).toEqual([-20, -12, -4, 4, 12, 20]);
  });
});
