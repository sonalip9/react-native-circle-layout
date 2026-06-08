import type { ReactNode } from 'react';
import type {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

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
 * The configuration for the animation.
 * @default undefined
 * @see https://reactnative.dev/docs/animated#timing
 */
export type AnimationConfig = Omit<
  Animated.TimingAnimationConfig,
  'toValue' | 'useNativeDriver'
>;

type AnimationProps = {
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
  animationConfigs: Partial<Record<AnimationType, AnimationConfig>>;
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

export type CircleLayoutProps = {
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
  animationProps?: AnimationProps;
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

export type CircleLayoutContextType = {
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
  animationProps?: AnimationProps | undefined;
};

export type Layout = {
  width: number;
  height: number;
};
