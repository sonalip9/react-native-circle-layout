import Svg, { Defs, Mask, Path } from 'react-native-svg';
import type { BgConfig, Layout } from './types';
import { Animated } from 'react-native';
import { use, useEffect, useMemo } from 'react';
import { useAnimatedSectorPath, useCombinedAnimation } from './hooks';
import { CircleLayoutContext } from './CircleLayoutContext';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export const Bg = ({
  index,
  radius,
  minComponentLayout,
  centerComponentLayout,
  isVisible = true,
  color = '#3d19e0',
  strokeColor,
  strokeWidth = 1,
  outerRadius,
  innerRadius = 0,
}: {
  index: number;
  radius: number;
  minComponentLayout: Layout;
  centerComponentLayout: Layout;
  isVisible?: boolean;
} & BgConfig) => {
  const { startAngle, sectorAngle } = use(CircleLayoutContext);
  const { startAngleInRadians, endAngleInRadians } = useMemo(() => {
    const angle = startAngle + index * sectorAngle;
    return {
      startAngleInRadians: angle - sectorAngle / 2,
      endAngleInRadians: angle + sectorAngle / 2,
    };
  }, [startAngle, sectorAngle, index]);

  const { size, center } = useMemo(() => {
    const padding = 0;
    const diameter = (outerRadius ?? radius) * 2;
    const width =
      diameter +
      minComponentLayout.width -
      centerComponentLayout.width / 2 +
      padding;
    const height =
      diameter +
      minComponentLayout.height -
      centerComponentLayout.height / 2 +
      padding;
    const s = Math.max(width, height);

    return { size: s, center: { x: s / 2, y: s / 2 } };
  }, [
    outerRadius,
    radius,
    minComponentLayout.width,
    minComponentLayout.height,
    centerComponentLayout.width,
    centerComponentLayout.height,
  ]);

  const {
    hideComponent,
    opacityValue,
    radiansValue,
    radiusValue,
    showComponent,
  } = useCombinedAnimation({
    index,
    radians: endAngleInRadians,
    startAngle: startAngleInRadians,
    radius: size / 2,
  });

  useEffect(() => {
    if (isVisible) {
      showComponent();
    } else {
      hideComponent();
    }
  }, [hideComponent, isVisible, showComponent]);

  const path = useAnimatedSectorPath({
    radius: radiusValue,
    startAngle: startAngleInRadians,
    endAngle: radiansValue,
    center,
  });

  return (
    <AnimatedSvg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: [
          { translateX: (-size + centerComponentLayout.width) / 2 },
          { translateY: (-size + centerComponentLayout.height) / 2 },
        ],
      }}
      width={size}
      height={size}
    >
      <Defs>
        <Mask id={`mask_${index}`}>
          <AnimatedPath d={path} fill="white" />
          <AnimatedPath
            d={useAnimatedSectorPath({
              radius: innerRadius,
              startAngle: startAngleInRadians,
              endAngle: endAngleInRadians,
              center,
            })}
            fill="black"
            stroke="black"
          />
        </Mask>
      </Defs>
      <AnimatedPath
        mask={`url(#mask_${index})`}
        d={path}
        fill={color}
        stroke={strokeColor ?? color}
        strokeOpacity={0.5}
        strokeWidth={strokeWidth}
        opacity={opacityValue}
      />
    </AnimatedSvg>
  );
};
