import type { ReactNode } from 'react';
import type { Animated, StyleProp, ViewStyle } from 'react-native';

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
  PARALLEL = 'parallel',
  SEQUENCE = 'sequence',
}

export type AnimationConfig = {
  type: AnimationType;
  config?: Omit<Animated.TimingAnimationConfig, 'toValue' | 'useNativeDriver'>;
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
  animationProps?: {
    /**
     * Array of animations to be performed on entry and exit of components.
     */
    animationConfigs: AnimationConfig[];
    /**
     * The type of composition animation to be performed with
     * all the animation configs provided.
     *
     * For those composition which perform animation in a particular order,
     * the order is picked by the order in the animationConfig array.
     */
    animationCombinationType: AnimationCombinationType;
    /**
     * The gap between the start of animation of 2 consecutive components.
     * This value is in milliseconds.
     */
    animationGap?: number;
  };
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
   * The radius of the circle on which the components will
   * be placed.
   */
  radius: number;
  /**
   * The angle at which the first component will be placed. The
   * value needs to be in radians.
   */
  startAngle: number;
  animationProps?:
    | {
        /**
         * Array of animations to be performed on entry and exit of components.
         */
        animationConfigs: AnimationConfig[];
        /**
         * The type of composition animation to be performed with
         * all the animation configs provided.
         *
         * For those composition which perform animation in a particular order,
         * the order is picked by the order in the animationConfig array.
         */
        animationCombinationType: AnimationCombinationType;
        /**
         * The gap between the start of animation of 2 consecutive components.
         * This value is in milliseconds.
         */
        animationGap?: number;
      }
    | undefined;
};
