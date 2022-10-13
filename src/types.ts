import type { ReactNode } from 'react';
import type { Animated, StyleProp, ViewStyle } from 'react-native';

type AnimationConfig = {
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
   */
  sweepAngle?: number;
  /**
   * The angle at which the first component will be placed. The
   * value needs to be in radians.
   */
  startAngle?: number;
  /**
   * The styling of the entire component's container.
   */
  containerStyle?: StyleProp<ViewStyle> | undefined;
  /**
   * The styling of the center component's container.
   */
  centerComponentContainerStyle?: StyleProp<ViewStyle> | undefined;
  /**
   * Flag to show or hide the components in the circle layout.
   * This flag is used to perform the start and end animation.
   */
  showComponents: boolean;
  /**
   * The configuration for the fade-in entry and fade-out exit
   * of the components. If this prop is undefined, then there
   * will be no animation.
   */
  opacityAnimationConfig?: AnimationConfig | undefined;
  /**
   * The configuration for the linear entry and exit
   * of the components. The components will start from the
   * center and move to their final positions. If this
   * prop is undefined, then there will be no animation.
   */
  linearAnimationConfig?: AnimationConfig | undefined;
};

export type ComponentProps = {
  /**
   * The value of the component that is plotted.
   */
  index: number;
  /**
   * The component to be displayed.
   */
  component: ReactNode;
  /**
   * The total number of components in the circle layout.
   */
  totalPoints: number;
  /**
   * The angle at which this component will be placed on the circle.
   */
  radians: number;
  /**
   * The radius of the circle on which the components will
   * be placed.
   */
  radius: number;
  /**
   * Flag to show or hide the component in the circle layout.
   * This flag is used to perform the start and end animation.
   */
  showComponent: boolean;
  /**
   * The configuration for the fade-in entry and fade-out exit
   * of the components. If this prop is undefined, then there
   * will be no animation.
   */
  opacityAnimationConfig?: AnimationConfig | undefined;
  /**
   * The configuration for the linear entry and exit
   * of the components. The components will start from the
   * center and move to their final positions. If this
   * prop is undefined, then there will be no animation.
   */
  linearAnimationConfig?: AnimationConfig | undefined;
};
