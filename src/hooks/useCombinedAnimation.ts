import React, { useMemo } from 'react';
import { Animated } from 'react-native';

import { CircleLayoutContext } from '../CircleLayoutContext';

import { useAnimation } from './useAnimation';

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

export const useCombinedAnimation = ({
  index,
  radians,
}: UseCombinedAnimation) => {
  const {
    totalPoints,
    circularAnimationConfig,
    linearAnimationConfig,
    opacityAnimationConfig,
    radius,
    startAngle,
  } = React.useContext(CircleLayoutContext);

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
      delay: (opacityAnimationConfig?.gap ?? 1000) * index,
      ...opacityAnimationConfig,
    },
    exitAnimationConfig: {
      delay: (opacityAnimationConfig?.gap ?? 1000) * (totalPoints - index - 1),
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
      delay: (linearAnimationConfig?.gap ?? 1000) * index,
      ...linearAnimationConfig,
    },
    exitAnimationConfig: {
      delay: (linearAnimationConfig?.gap ?? 1000) * (totalPoints - index - 1),
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
      delay: (circularAnimationConfig?.gap ?? 1000) * index,
      ...circularAnimationConfig,
    },
    exitAnimationConfig: {
      delay: (circularAnimationConfig?.gap ?? 1000) * (totalPoints - index - 1),
      ...circularAnimationConfig,
    },
  });
  // The value of radians depending on the props of the component.
  const radiansValue = useMemo(
    () => (circularAnimationConfig && animatedRadians) || radians,
    [circularAnimationConfig, radians, animatedRadians]
  );

  const hideComponent = React.useCallback(() => {
    const animationList: Array<Animated.CompositeAnimation> = [];
    if (opacityAnimationConfig) animationList.push(opacityExitAnimation());
    if (linearAnimationConfig) animationList.push(linearExitAnimation());
    if (circularAnimationConfig) animationList.push(circularExitAnimation());
    Animated.parallel(animationList).start(() => {
      setComponentVisible(false);
    });
  }, [
    circularAnimationConfig,
    circularExitAnimation,
    linearAnimationConfig,
    linearExitAnimation,
    opacityAnimationConfig,
    opacityExitAnimation,
  ]);

  const showComponent = React.useCallback(() => {
    const animationList: Array<Animated.CompositeAnimation> = [];
    if (opacityAnimationConfig) animationList.push(opacityEntryAnimation());
    if (linearAnimationConfig) animationList.push(linearEntryAnimation());
    if (circularAnimationConfig) animationList.push(circularEntryAnimation());
    Animated.parallel(animationList).start(() => {
      setComponentVisible(true);
    });
  }, [
    circularAnimationConfig,
    circularEntryAnimation,
    linearAnimationConfig,
    linearEntryAnimation,
    opacityAnimationConfig,
    opacityEntryAnimation,
  ]);

  return {
    opacityValue,
    radiansValue,
    radiusValue,
    hideComponent,
    showComponent,
    componentVisible,
  };
};
