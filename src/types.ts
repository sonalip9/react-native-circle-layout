import type { ReactNode } from 'react';
import type { Animated, StyleProp, ViewStyle } from 'react-native';

export type AnimationConfig = {
  /**
   * The gap between the start of animation of 2 consecutive components.
   * This value is in milliseconds.
   */
  gap: number;
} & Omit<Animated.TimingAnimationConfig, 'toValue' | 'useNativeDriver'>;

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
   * The configuration for the fade-in entry and fade-out exit
   * of the components. If this prop is undefined, then there
   * will be no animation.
   * @default undefined
   */
  opacityAnimationConfig?: AnimationConfig | undefined;
  /**
   * The configuration for the linear entry and exit animations
   * of the components. The components will start from the
   * center and move to their final positions. If this
   * prop is undefined, then there will be no animation.
   * @default undefined
   */
  linearAnimationConfig?: AnimationConfig | undefined;
  /**
   * The configuration for the circle entry and exit animations
   * of the components. The components will start from the
   * position of the first component and move along the
   * circumference of the circle to their final positions. If this
   * prop is undefined, then there will be no animation.
   * @default undefined
   */
  circularAnimationConfig?: AnimationConfig | undefined;
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
  /**
   * Flag to maintain the visibility state of the components.
   */
  componentsVisible: boolean;
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
  /**
   * Flag to maintain the visibility state of the component.
   */
  componentVisible: boolean;
};

export type CircleLayoutContextType = {
  /**
   * The total number of parts the circle is divided into.
   */
  totalParts: number;
  /**
   * The configuration for the fade-in entry and fade-out exit
   * of the components. If this prop is undefined, then there
   * will be no animation.
   * @default undefined
   */
  opacityAnimationConfig?: AnimationConfig | undefined;
  /**
   * The configuration for the linear entry and exit
   * of the components. The components will start from the
   * center and move to their final positions. If this
   * prop is undefined, then there will be no animation.
   * @default undefined
   */
  linearAnimationConfig?: AnimationConfig | undefined;
  /**
   * The configuration for the circle entry and exit animations
   * of the components. The components will start from the
   * position of the first component and move along the
   * circumference of the circle to their final positions. If this
   * prop is undefined, then there will be no animation.
   * @default undefined
   */
  circularAnimationConfig?: AnimationConfig | undefined;
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
};
