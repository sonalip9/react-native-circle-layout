import React, { useMemo } from 'react';

import { CircleLayoutContext } from '../CircleLayoutContext';
import { AnimationCombinationType, AnimationType } from '../types';

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
  /**
   * The angle from which the component will start its circular animation.
   * Defaults to the starting angle of the context if not provided.
   */
  startAngle?: number;
  /**
   * The radius from which the component will end its linear animation.
   * The component will start its linear animation from the center of the
   * circle (radius 0) to this radius value.
   * Defaults to context radius value if not provided.
   */
  radius?: number;
};

/**
 * A hook to perform entry and exit animation of each of the config
 * passed.
 * @param props The props passed to the hook.
 * @param props.index The value of the component that is plotted.
 * @param props.radians The angle at which this component will be placed on the circle.
 * @param props.startAngle The angle from which the component will start its circular animation.
 * Defaults to the starting angle of the context if not provided.
 * @param props.radius The radius from which the component will start its linear animation.
 * Defaults to context radius value if not provided.
 * @returns An object containing animated value for the animation config passed,
 * the entry and exit functions and the visibility state of the component.
 */
export const useCombinedAnimation = ({
  index,
  radians,
  startAngle,
  radius,
}: UseCombinedAnimation) => {
  const {
    totalParts,
    animationProps,
    animationDriver: driver,
    radius: contextRadius,
    startAngle: contextStartAngle,
  } = React.use(CircleLayoutContext);

  const opacityAnimationConfig =
    animationProps?.animationConfigs[AnimationType.OPACITY];
  const linearAnimationConfig =
    animationProps?.animationConfigs[AnimationType.LINEAR];
  const circularAnimationConfig =
    animationProps?.animationConfigs[AnimationType.CIRCULAR];

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
    driver,
    initialValue: 0,
    finalValue: 1,
    entryAnimationConfig: opacityAnimationConfig ?? {},
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
    driver,
    initialValue: 0,
    finalValue: radius ?? contextRadius,
    entryAnimationConfig: linearAnimationConfig ?? {},
  });
  // The value of radius depending on the props of the component.
  const radiusValue = useMemo(
    () => (linearAnimationConfig && animatedRadius) || radius || contextRadius,
    [linearAnimationConfig, radius, animatedRadius, contextRadius]
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
    driver,
    initialValue: startAngle ?? contextStartAngle,
    finalValue: radians,
    entryAnimationConfig: circularAnimationConfig ?? {},
  });
  // The value of radians depending on the props of the component.
  const radiansValue = useMemo(
    () => (circularAnimationConfig && animatedRadians) || radians,
    [circularAnimationConfig, radians, animatedRadians]
  );

  type Composite = ReturnType<typeof driver.delay>;

  const { entryList: entryAnimationList, exitList: exitAnimationList } =
    React.useMemo(() => {
      if (animationProps === undefined)
        return { entryList: undefined, exitList: undefined };

      const { entryList, exitList } = (
        Object.keys(animationProps.animationConfigs) as AnimationType[]
      )
        .filter((type) => animationProps.animationConfigs[type] !== undefined)
        .reduce(
          ({ entryList: entry, exitList: exit }, type) => {
            switch (type) {
              case AnimationType.OPACITY:
                entry.push(opacityEntryAnimation());
                exit.unshift(opacityExitAnimation());
                break;
              case AnimationType.LINEAR:
                entry.push(linearEntryAnimation());
                exit.unshift(linearExitAnimation());
                break;
              case AnimationType.CIRCULAR:
                entry.push(circularEntryAnimation());
                exit.unshift(circularExitAnimation());
                break;
              default:
                throw new Error('Unrecognized config type');
            }
            return { entryList: entry, exitList: exit };
          },
          {
            entryList: [] as Composite[],
            exitList: [] as Composite[],
          }
        );

      entryList.unshift(
        driver.delay(index * (animationProps.animationGap ?? 0))
      );
      exitList.unshift(
        driver.delay(
          (totalParts - index - 1) * (animationProps.animationGap ?? 0)
        )
      );

      return { entryList, exitList };
    }, [
      animationProps,
      circularEntryAnimation,
      circularExitAnimation,
      driver,
      index,
      linearEntryAnimation,
      linearExitAnimation,
      opacityEntryAnimation,
      opacityExitAnimation,
      totalParts,
    ]);

  /**
   * Function to hide the component by performing the animation configs passed.
   */
  const hideComponent = React.useCallback(() => {
    if (exitAnimationList) {
      switch (animationProps?.animationCombinationType) {
        case AnimationCombinationType.SEQUENCE:
          driver.start(driver.sequence(exitAnimationList), () => {
            setComponentVisible(false);
          });
          break;
        default:
          driver.start(driver.parallel(exitAnimationList), () => {
            setComponentVisible(false);
          });
          break;
      }
    } else {
      setComponentVisible(false);
    }
  }, [animationProps?.animationCombinationType, driver, exitAnimationList]);

  /**
   * Function to show the component by performing the animation configs passed.
   */
  const showComponent = React.useCallback(() => {
    if (entryAnimationList) {
      switch (animationProps?.animationCombinationType) {
        case AnimationCombinationType.SEQUENCE:
          driver.start(driver.sequence(entryAnimationList), () => {
            setComponentVisible(true);
          });
          break;
        default:
          driver.start(driver.parallel(entryAnimationList), () => {
            setComponentVisible(true);
          });
          break;
      }
    } else {
      setComponentVisible(true);
    }
  }, [
    animationProps?.animationCombinationType,
    driver,
    entryAnimationList,
    setComponentVisible,
  ]);

  return {
    opacityValue,
    radiansValue,
    radiusValue,
    hideComponent,
    showComponent,
  };
};
