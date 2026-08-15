import { use, useLayoutEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { CircleLayoutContext } from './CircleLayoutContext';
import { VisibilityContext } from './VisibilityContext';
import { useCombinedAnimation } from './hooks';
import { circleComponentStyles } from './styles';
import type { ComponentProps, Layout } from './types';
import { pointOnCircle, pointOnCircleAnimated } from './utils';

/**
 * A component that positions one component in the circle layout.
 * @param props  The properties passed to the component
 * @param props.component The component to be displayed.
 * @param props.index The position of the component in the circle layout.
 * @param props.radians The angle at which this component will be placed on the circle.
 * @param props.onLayout The function that is called when the layout of the component
 * is calculated. The event passed to the function contains the layout values of the component
 * which can be used to calculate the position of the component on the circle.
 * @param props.centerComponentLayout The layout of the center component which is used to
 * calculate the position of the components on the circle.
 * @returns A component that is placed at a point on the circle.
 */
export const CircleLayoutComponent = ({
  component,
  index,
  radians,
  onLayout,
  centerComponentLayout,
}: ComponentProps) => {
  const { animationDriver: driver } = use(CircleLayoutContext);
  const isVisible = use(VisibilityContext);

  /* eslint-disable react-hooks/static-components, @eslint-react/static-components -- AnimatedView is memoized on `driver` (a dynamic, pluggable prop), not a module-level constant, so it's necessarily defined inside the component; its identity stays stable across renders as long as `driver` doesn't change. */
  const AnimatedView = useMemo(
    () => driver.createAnimatedComponent(View),
    [driver]
  );

  const [layout, setLayout] = useState<Layout>({
    width: 0,
    height: 0,
  });
  const {
    hideComponent,
    showComponent,
    opacityValue: opacity,
    radiansValue,
    radiusValue,
  } = useCombinedAnimation({ index, radians });

  // The position of the component.
  // This is animated if either linear or circular animation config is passed.
  const position =
    typeof radiansValue === 'number' && typeof radiusValue === 'number'
      ? pointOnCircle({ radians: radiansValue, radius: radiusValue })
      : pointOnCircleAnimated({
          driver,
          radians: radiansValue,
          radius: radiusValue,
        });

  useLayoutEffect(() => {
    if (isVisible) {
      showComponent();
    } else {
      hideComponent();
    }
  }, [hideComponent, isVisible, showComponent]);

  return (
    <AnimatedView
      style={[
        circleComponentStyles.componentContainer,
        {
          opacity: opacity as number,
          transform: [
            {
              translateX: driver.multiply(
                driver.subtract(
                  position.x,
                  (layout.width - centerComponentLayout.width) / 2
                ),
                -1
              ) as number,
            },
            {
              translateY: driver.multiply(
                driver.subtract(
                  position.y,
                  (layout.height - centerComponentLayout.height) / 2
                ),
                -1
              ) as number,
            },
          ],
        },
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
        onLayout?.(event);
      }}
    >
      {component}
    </AnimatedView>
  );
  /* eslint-enable react-hooks/static-components, @eslint-react/static-components -- end of the driver-dependent animated component region (see disable comment above AnimatedView). */
};
