import Svg, { Path } from 'react-native-svg';
import type { ResolvedBgConfig, Layout } from './types';
import { use, useLayoutEffect, useMemo } from 'react';
import { useAnimatedSectorPath, useCombinedAnimation } from './hooks';
import { CircleLayoutContext } from './CircleLayoutContext';

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
} & ResolvedBgConfig) => {
  const {
    sectorAngles,
    componentAngles,
    animationDriver: driver,
  } = use(CircleLayoutContext);

  /* eslint-disable react-hooks/static-components, @eslint-react/static-components -- AnimatedSvg/AnimatedPath are memoized on `driver` (a dynamic, pluggable prop), not module-level constants, so they're necessarily defined inside the component; their identity stays stable across renders as long as `driver` doesn't change. */
  const AnimatedSvg = useMemo(
    () => driver.createAnimatedComponent(Svg),
    [driver]
  );
  const AnimatedPath = useMemo(
    () => driver.createAnimatedComponent(Path),
    [driver]
  );

  const { startAngleInRadians, endAngleInRadians } = useMemo(() => {
    const angle = componentAngles[index]!;
    const sector = sectorAngles[index]!;
    return {
      startAngleInRadians: angle - sector / 2,
      endAngleInRadians: angle + sector / 2,
    };
  }, [componentAngles, sectorAngles, index]);

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
    useNativeDriver: false,
  });

  useLayoutEffect(() => {
    if (isVisible) {
      showComponent();
    } else {
      hideComponent();
    }
  }, [hideComponent, isVisible, showComponent]);

  const path = useAnimatedSectorPath({
    driver,
    radius: radiusValue,
    startAngle: startAngleInRadians,
    endAngle: radiansValue,
    center,
    innerRadius,
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
      <AnimatedPath
        d={path as string}
        fill={color}
        stroke={strokeColor ?? color}
        strokeOpacity={0.5}
        strokeWidth={strokeWidth}
        opacity={opacityValue as number}
      />
    </AnimatedSvg>
  );
  /* eslint-enable react-hooks/static-components, @eslint-react/static-components -- end of the driver-dependent animated component region (see disable comment above AnimatedSvg/AnimatedPath). */
};
