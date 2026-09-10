import {
  AnimationCombinationType,
  type AnimationConfig,
  type AnimationDriver,
  type AnimationType,
  rnAnimatedDriver,
} from 'react-native-circle-layout';

type AnimationConfigs<D extends AnimationDriver> = Partial<
  Record<AnimationType, AnimationConfig<D>>
>;

/**
 * All configured types animate together, each delayed `gap`ms past the previous component's start.
 * @param configs - animation config per {@link AnimationType} to run
 * @param gap - delay in ms between the start of consecutive components' animations
 * @returns an `animationProps` value for `CircleLayout`
 */
export function parallelAnimation<
  D extends AnimationDriver = typeof rnAnimatedDriver,
>(configs: AnimationConfigs<D>, gap?: number) {
  return {
    animationCombinationType: AnimationCombinationType.PARALLEL,
    animationConfigs: configs,
    animationGap: gap,
  };
}

/**
 * Components animate one after another, `gap`ms apart.
 * @param configs - animation config per {@link AnimationType} to run
 * @param gap - delay in ms between the start of consecutive components' animations
 * @returns an `animationProps` value for `CircleLayout`
 */
export function sequenceAnimation<
  D extends AnimationDriver = typeof rnAnimatedDriver,
>(configs: AnimationConfigs<D>, gap?: number) {
  return {
    animationCombinationType: AnimationCombinationType.SEQUENCE,
    animationConfigs: configs,
    animationGap: gap,
  };
}
