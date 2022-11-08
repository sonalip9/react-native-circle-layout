import React, { useMemo } from 'react';
import { Animated } from 'react-native';

import { CircleLayoutContext } from '../CircleLayoutContext';

import { useAnimation } from './useAnimation';

import { AnimationType } from 'src/types';

const DEFAULT_DELAY = 0;

type UseCombinedAnimation = {
  /**
   * The value of the component that is plotted.
   */
  index: number;
  /**
   * The angle at which this component will be placed on the circle.
   */
  radians: number;
};

/**
 * A hook to perform entry and exit animation of each of the config
 * passed.
 * @param props The props passed to the hook.
 * @returns An object containing animated value for the animation config passed,
 * the entry and exit functions and the visibility state of the component.
 */
export const useCombinedAnimation = ({
  index,
  radians,
}: UseCombinedAnimation) => {
  const {
    totalParts: totalPoints,
    animationConfigs,
    radius,
    startAngle,
  } = React.useContext(CircleLayoutContext);

  const opacityAnimationConfig = animationConfigs?.find(
    (config) => config.type === AnimationType.OPACITY
  )?.config;
  const linearAnimationConfig = animationConfigs?.find(
    (config) => config.type === AnimationType.LINEAR
  )?.config;
  const circularAnimationConfig = animationConfigs?.find(
    (config) => config.type === AnimationType.CIRCULAR
  )?.config;

  /**
   * A flag to determine the visibility state of the component.
   */
  const [componentVisible, setComponentVisible] = React.useState(true);

  /**
   * The animated value that is responsible for the opacity of the component.
   */
  const {
    value: opacityAnimated,
    entryAnimation: opacityEntryAnimation,
    exitAnimation: opacityExitAnimation,
  } = useAnimation({
    initialValue: 0,
    finalValue: 1,
    entryAnimationConfig: {
      delay: (opacityAnimationConfig?.gap ?? DEFAULT_DELAY) * index,
      ...opacityAnimationConfig,
    },
    exitAnimationConfig: {
      delay:
        (opacityAnimationConfig?.gap ?? DEFAULT_DELAY) *
        (totalPoints - index - 1),
      ...opacityAnimationConfig,
    },
  });
  // The value of opacity depending on the props of the component.
  const opacityValue = React.useMemo(
    () =>
      (opacityAnimationConfig && opacityAnimated) || (componentVisible ? 1 : 0),
    [componentVisible, opacityAnimationConfig, opacityAnimated]
  );

  /**
   * The animated value that is responsible for the radius of the component.
   * This results in the linear animation of the component from the center to its
   * final position.
   */
  const {
    value: animatedRadius,
    entryAnimation: linearEntryAnimation,
    exitAnimation: linearExitAnimation,
  } = useAnimation({
    initialValue: 0,
    finalValue: radius,
    entryAnimationConfig: {
      delay: (linearAnimationConfig?.gap ?? DEFAULT_DELAY) * index,
      ...linearAnimationConfig,
    },
    exitAnimationConfig: {
      delay:
        (linearAnimationConfig?.gap ?? DEFAULT_DELAY) *
        (totalPoints - index - 1),
      ...linearAnimationConfig,
    },
  });
  // The value of radius depending on the props of the component.
  const radiusValue = useMemo(
    () => (linearAnimationConfig && animatedRadius) || radius,
    [linearAnimationConfig, radius, animatedRadius]
  );

  /**
   * The animated value that is responsible for the radians of the component.
   * This results in the circular animation of the component from the position of
   * the first component to its final position.
   */
  const {
    value: animatedRadians,
    entryAnimation: circularEntryAnimation,
    exitAnimation: circularExitAnimation,
  } = useAnimation({
    initialValue: startAngle,
    finalValue: radians,
    entryAnimationConfig: {
      delay: (circularAnimationConfig?.gap ?? DEFAULT_DELAY) * index,
      ...circularAnimationConfig,
    },
    exitAnimationConfig: {
      delay:
        (circularAnimationConfig?.gap ?? DEFAULT_DELAY) *
        (totalPoints - index - 1),
      ...circularAnimationConfig,
    },
  });
  // The value of radians depending on the props of the component.
  const radiansValue = useMemo(
    () => (circularAnimationConfig && animatedRadians) || radians,
    [circularAnimationConfig, radians, animatedRadians]
  );

  const entryAnimationList = React.useMemo(
    () =>
      animationConfigs?.map((animationConfig) => {
        switch (animationConfig.type) {
          case AnimationType.OPACITY:
            return opacityEntryAnimation();
          case AnimationType.LINEAR:
            return linearEntryAnimation();
          case AnimationType.CIRCULAR:
            return circularEntryAnimation();
          default:
            throw new Error(`Unrecognized config type`);
        }
      }),
    [
      animationConfigs,
      circularEntryAnimation,
      linearEntryAnimation,
      opacityEntryAnimation,
    ]
  );

  const exitAnimationList = React.useMemo(
    () =>
      animationConfigs?.map((animationConfig) => {
        switch (animationConfig.type) {
          case AnimationType.OPACITY:
            return opacityExitAnimation();
          case AnimationType.LINEAR:
            return linearExitAnimation();
          case AnimationType.CIRCULAR:
            return circularExitAnimation();
          default:
            throw new Error(`Unrecognized config type`);
        }
      }),
    [
      animationConfigs,
      circularExitAnimation,
      linearExitAnimation,
      opacityExitAnimation,
    ]
  );

  /**
   * Function to hide the component by performing the animation configs passed.
   */
  const hideComponent = React.useCallback(() => {
    if (exitAnimationList) {
      Animated.parallel(exitAnimationList).start(() => {
        setComponentVisible(false);
      });
    }
  }, [exitAnimationList]);

  /**
   * Function to show the component by performing the animation configs passed.
   */
  const showComponent = React.useCallback(() => {
    if (entryAnimationList) {
      Animated.parallel(entryAnimationList).start(() => {
        setComponentVisible(true);
      });
    }
  }, [entryAnimationList]);

  return {
    opacityValue,
    radiansValue,
    radiusValue,
    hideComponent,
    showComponent,
    componentVisible,
  };
};
