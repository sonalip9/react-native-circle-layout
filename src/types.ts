import type { ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

import type { AnimationDriver, DriverConfig } from './animation/types';
import { rnAnimatedDriver } from './animation/rnAnimatedDriver';

export enum AnimationType {
  /**
   * The configuration for the fade-in entry and fade-out exit
   * of the components. If this prop is undefined, then there
   * will be no animation.
   */
  OPACITY = 'opacityAnimationConfig',
  /**
   * The configuration for the linear entry and exit animations
   * of the components. The components will start from the
   * center and move to their final positions. If this
   * prop is undefined, then there will be no animation.
   */
  LINEAR = 'linearAnimationConfig',
  /**
   * The configuration for the circle entry and exit animations
   * of the components. The components will start from the
   * position of the first component and move along the
   * circumference of the circle to their final positions. If this
   * prop is undefined, then there will be no animation.
   */
  CIRCULAR = 'circularAnimationConfig',
}

export enum AnimationCombinationType {
  /**
   * The components will be animated at the same time.
   */
  PARALLEL = 'parallel',
  /**
   * The components will be animated one after the other.
   */
  SEQUENCE = 'sequence',
}

/**
 * The configuration for the animation. The shape of this type is determined
 * by the {@link AnimationDriver} in use — by default (the React Native
 * `Animated`-backed driver) it mirrors `Animated.TimingAnimationConfig`.
 * @default undefined
 * @see AnimationDriver
 * @see https://reactnative.dev/docs/animated#timing
 */
export type AnimationConfig<
  D extends AnimationDriver = typeof rnAnimatedDriver,
> = DriverConfig<D>;

type AnimationProps<D extends AnimationDriver = typeof rnAnimatedDriver> = {
  /**
   * The configuration for the animation. The key of the record is the type of
   * animation and the value is the configuration for that animation. If a particular
   * animation type is not provided, then that animation will not be performed.
   *
   * The order of the animation is determined by the key order of the object.
   * @see AnimationType
   * @see AnimationConfig
   * @example
   * {
   *  [AnimationType.OPACITY]: {
   *    duration: 500,
   *    easing: Easing.inOut(Easing.ease),
   *  },
   *  [AnimationType.LINEAR]: {
   *    duration: 500,
   *  },
   * }
   */
  animationConfigs: Partial<Record<AnimationType, AnimationConfig<D>>>;
  /**
   * The type of composition animation to be performed with
   * all the animation configs provided.
   *
   * For those composition which perform animation in a particular order,
   * the order is picked by the key order of the animationConfigs object.
   * @see AnimationCombinationType
   */
  animationCombinationType: AnimationCombinationType;
  /**
   * The gap between the start of animation of 2 consecutive components.
   * This value is in milliseconds.
   * @default 0
   */
  animationGap?: number;
};

export type BgConfig = {
  /**
   * The fill color for the background of the circle layout.
   * @default #3d19e0
   */
  color?: string;
  /**
   * The stroke color for the divider lines in the background.
   * @default color
   */
  strokeColor?: string;
  /**
   * The width of the stroke for the divider lines in the background.
   * @default 1
   */
  strokeWidth?: number;
  /**
   * The radius of the inner circle in the background.
   * If this prop is not provided, then there will be no inner circle in
   * the background and the background will be a filled circle with the
   * radius provided in the CircleLayoutProps.
   * If this prop is provided, then the background will have a donut shape
   * with the outer radius provided in the CircleLayoutProps and the
   * inner radius provided in this prop.
   * @default 0
   */
  innerRadius?: number;
  /**
   * The radius of the outer circle in the background.
   * If this prop is not provided, then the radius provided in the
   * CircleLayoutProps will be used as the outer radius of the background.
   * @default radius provided in CircleLayoutProps
   * @see CircleLayoutProps.radius
   * @see BgConfig.innerRadius
   */
  outerRadius?: number;
};

export type CircleLayoutProps<
  D extends AnimationDriver = typeof rnAnimatedDriver,
> = {
  /**
   * The list of components that needs to be placed in the circle.
   */
  components: React.ReactNode[];
  /**
   * The component to be placed at the center.
   * @default undefined
   */
  centerComponent?: React.ReactNode | undefined;
  /**
   * The radius of the circle on which the components will
   * be placed.
   */
  radius: number;
  /**
   * The distance in radians to be covered from the starting point. The
   * value needs to be in radians.
   * @default 2 * Math.PI
   */
  sweepAngle?: number;
  /**
   * The angle at which the first component will be placed. The
   * value needs to be in radians.
   * @default 0
   */
  startAngle?: number;
  /**
   * The styling of the entire component's container.
   * @default undefined
   */
  containerStyle?: StyleProp<ViewStyle> | undefined;
  /**
   * The styling of the center component's container.
   * @default undefined
   */
  centerComponentContainerStyle?: StyleProp<ViewStyle> | undefined;
  /**
   * The props for the animation.
   * @default undefined
   * @see AnimationProps
   */
  animationProps?: AnimationProps<D>;
  /**
   * The fill color for the background of the circle layout.
   * If this prop is not provided, then the background will not be shown.
   * @default undefined
   */
  bgConfig?: BgConfig | undefined;
  /**
   * The animation driver used to power entry/exit and background animations.
   * Defaults to a driver backed by React Native's core `Animated` API. Pass a
   * custom driver to power animations with a different animation library
   * (e.g. Reanimated, Moti).
   * @default rnAnimatedDriver
   * @see AnimationDriver
   */
  animationDriver?: D;
};

export type CircleLayoutRef = {
  /**
   * Function to show every component in the circle layout by
   * performing animation according to the passed config.
   */
  showComponents: () => void;
  /**
   * Function to hide every component in the circle layout by
   * performing animation according to the passed config.
   */
  hideComponents: () => void;
};

export type ComponentProps = {
  /**
   * The component to be displayed.
   */
  component: ReactNode;
  /**
   * The value of the component that is plotted.
   */
  index: number;
  /**
   * The angle at which this component will be placed on the circle.
   */
  radians: number;
  /**
   * The function that is called when the layout of the component
   * is calculated. The event passed to the function contains the
   * layout values of the component which can be used to calculate
   * the position of the component on the circle.
   */
  onLayout?: (event: LayoutChangeEvent) => void;
  /**
   * The layout values of the component which can be used to calculate
   * the position of the component on the circle. This is calculated
   * when the layout of the component is calculated and is passed to
   * the parent CircleLayout component through the onLayout prop.
   */
  centerComponentLayout: Layout;
};

export type ComponentRef = {
  /**
   * Function to show the component in the circle layout by
   * performing animation according to the passed config.
   */
  showComponent: () => void;
  /**
   * Function to hide component in the circle layout by
   * performing animation according to the passed config.
   */
  hideComponent: () => void;
};

export type CircleLayoutContextType<
  D extends AnimationDriver = typeof rnAnimatedDriver,
> = {
  /**
   * The total number of parts the circle is divided into.
   */
  totalParts: number;
  /**
   * The radius of the circle on which the components will
   * be placed.
   */
  radius: number;
  /**
   * The angle at which the first component will be placed. The
   * value needs to be in radians.
   */
  startAngle: number;
  /**
   * The props for the animation.
   * @default undefined
   */
  animationProps?: AnimationProps<D> | undefined;
  /**
   * The animation driver used to power entry/exit and background animations.
   */
  animationDriver: D;
  /**
   * The angle in radians between the position of 2 consecutive components on the circle.
   * This value is calculated by dividing the sweepAngle by the total number of parts.
   */
  sectorAngle: number;
};

export type Layout = {
  width: number;
  height: number;
};
