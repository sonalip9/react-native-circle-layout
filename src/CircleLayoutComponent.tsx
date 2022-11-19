import React, { forwardRef, useImperativeHandle } from 'react';
import { Animated } from 'react-native';

import { useCombinedAnimation } from './hooks';
import { circleComponentStyles } from './styles';
import type { ComponentProps, ComponentRef } from './types';
import { pointOnCircle } from './utils';

/**
 * A component that positions one component in the circle layout.
 * @param props  The properties passed to the component
 * @returns A component that is placed at a point on the circle.
 */
export const CircleLayoutComponent = forwardRef<ComponentRef, ComponentProps>(
  ({ component, index, radians }: ComponentProps, ref) => {
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
              { translateX: Animated.multiply(position.x, -1) },
              { translateY: Animated.multiply(position.y, -1) },
            ],
          },
        ]}
      >
        {component}
      </Animated.View>
    );
  }
);
