import { useImperativeHandle, useState, type Ref } from 'react';
import { Animated } from 'react-native';

import { useCombinedAnimation } from './hooks';
import { circleComponentStyles } from './styles';
import type { ComponentProps, ComponentRef, Layout } from './types';
import { pointOnCircle } from './utils';

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
 * @param props.ref The ref that is used to expose the show and hide function of the
 * component to parent components.
 * @returns A component that is placed at a point on the circle.
 */
export const CircleLayoutComponent = ({
  component,
  index,
  radians,
  onLayout,
  centerComponentLayout,
  ref,
}: ComponentProps & { ref: Ref<ComponentRef> }) => {
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
  const position = pointOnCircle({
    radians: radiansValue,
    radius: radiusValue,
  });

  /**
   * The instance value that is exposed to parent components when using ref.
   */
  useImperativeHandle(ref, () => ({
    showComponent,
    hideComponent,
  }));

  return (
    <Animated.View
      style={[
        circleComponentStyles.componentContainer,
        {
          opacity,
          transform: [
            {
              translateX: Animated.multiply(
                Animated.subtract(
                  position.x,
                  layout.width / 2 - centerComponentLayout.width / 2
                ),
                -1
              ),
            },

            {
              translateY: Animated.multiply(
                Animated.subtract(
                  position.y,
                  layout.height / 2 - centerComponentLayout.height / 2
                ),
                -1
              ),
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
    </Animated.View>
  );
};
