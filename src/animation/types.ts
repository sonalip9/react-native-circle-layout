import type { ComponentType } from 'react';

import type { InterpolationConfig } from '../utils/animation';

/**
 * An abstraction over an animation library's primitives. The library only
 * ever touches animation state through this interface, which lets consumers
 * plug in any animation library (Reanimated, Moti, etc.) by providing their
 * own implementation via the `animationDriver` prop on `CircleLayout`.
 *
 * The default implementation, {@link rnAnimatedDriver}, is backed by React
 * Native's core `Animated` API.
 * @template TValue The type of a mutable animated numeric node.
 * @template TInterpolated The type of a derived/interpolated animated node.
 * @template TComposite The type of a runnable (composable) animation.
 * @template TConfig The type of the driver-specific timing configuration.
 */
export interface AnimationDriver<
  TValue = unknown,
  TInterpolated = unknown,
  TComposite = unknown,
  TConfig = unknown,
> {
  /**
   * Creates a mutable animated numeric value with the given initial value.
   */
  createValue(initialValue: number): TValue;
  /**
   * Imperatively (synchronously) sets the current number of an animated value.
   */
  setValue(value: TValue, newValue: number): void;
  /**
   * Subscribes to changes of an animated value's current number.
   * @returns A function that unsubscribes the listener.
   */
  addValueListener(
    value: TValue,
    callback: (current: number) => void
  ): () => void;
  /**
   * Builds a runnable timing animation that animates `value` towards `toValue`
   * using the provided driver-specific configuration.
   */
  timing(value: TValue, toValue: number, config: TConfig): TComposite;
  /**
   * Composes a list of animations to run one after another.
   */
  sequence(animations: TComposite[]): TComposite;
  /**
   * Composes a list of animations to run concurrently.
   */
  parallel(animations: TComposite[]): TComposite;
  /**
   * Creates a runnable no-op animation that waits for the given duration,
   * composable within {@link sequence}/{@link parallel} lists.
   */
  delay(durationMs: number): TComposite;
  /**
   * Starts a runnable animation, invoking `onComplete` once it finishes.
   */
  start(animation: TComposite, onComplete?: () => void): void;
  /**
   * Multiplies two animated nodes and/or numbers, producing a derived node.
   */
  multiply(
    a: TValue | TInterpolated | number,
    b: TValue | TInterpolated | number
  ): TInterpolated;
  /**
   * Subtracts `b` from `a` for animated nodes and/or numbers, producing a
   * derived node.
   */
  subtract(
    a: TValue | TInterpolated | number,
    b: TValue | TInterpolated | number
  ): TInterpolated;
  /**
   * Derives a value of type `T` from a numeric animated node by sampling
   * `callback` over a generated input range. Used to drive non-numeric
   * outputs (e.g. SVG path strings) from a numeric animated node.
   */
  interpolate<T extends number | string>(
    value: TValue | TInterpolated,
    callback: (sample: number) => T,
    config?: InterpolationConfig
  ): TInterpolated;
  /**
   * Type guard distinguishing an animated node created by this driver from a
   * plain number.
   */
  isAnimatedValue(value: unknown): value is TValue;
  /**
   * Wraps a host component so that it accepts animated style/props.
   */
  createAnimatedComponent<P extends object>(
    Component: ComponentType<P>
  ): ComponentType<P>;
}

/**
 * The animated node types (mutable or derived) produced by a given driver.
 */
export type AnimatedNode<D extends AnimationDriver> =
  D extends AnimationDriver<infer TValue, infer TInterpolated, unknown, unknown>
    ? TValue | TInterpolated
    : never;

/**
 * The driver-specific timing configuration type for a given driver.
 */
export type DriverConfig<D extends AnimationDriver> =
  D extends AnimationDriver<unknown, unknown, unknown, infer TConfig>
    ? TConfig
    : never;

/**
 * The mutable animated numeric value type produced by a given driver.
 */
export type DriverValue<D extends AnimationDriver> =
  D extends AnimationDriver<infer TValue, unknown, unknown, unknown>
    ? TValue
    : never;

/**
 * The runnable (composable) animation type produced by a given driver.
 */
export type DriverComposite<D extends AnimationDriver> =
  D extends AnimationDriver<unknown, unknown, infer TComposite, unknown>
    ? TComposite
    : never;
