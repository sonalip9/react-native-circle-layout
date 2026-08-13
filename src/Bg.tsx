import Svg, { Path } from 'react-native-svg';
import type { ResolvedBgConfig, Layout } from './types';
import { use, useLayoutEffect, useMemo } from 'react';
import { useAnimatedSectorPath, useCombinedAnimation } from './hooks';
import { CircleLayoutContext } from './CircleLayoutContext';
import { VisibilityContext } from './VisibilityContext';
import { resolveBgGeometry } from './utils/circle';

export const Bg = ({
  index,
  radius,
  minComponentLayout,
  centerComponentLayout,
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
} & ResolvedBgConfig) => {
  const {
    sectorAngles,
    componentAngles,
    totalParts,
    animationDriver: driver,
  } = use(CircleLayoutContext);
  const isVisible = use(VisibilityContext);

  /* eslint-disable react-hooks/static-components, @eslint-react/static-components -- AnimatedSvg/AnimatedPath are memoized on `driver` (a dynamic, pluggable prop), not module-level constants, so they're necessarily defined inside the component; their identity stays stable across renders as long as `driver` doesn't change. */
  const AnimatedSvg = useMemo(
    () => driver.createAnimatedComponent(Svg),
    [driver]
  );
  const AnimatedPath = useMemo(
    () => driver.createAnimatedComponent(Path),
    [driver]
  );

  const { startAngleInRadians, endAngleInRadians, size, center } = useMemo(
    () =>
      resolveBgGeometry({
        index,
        componentAngles,
        sectorAngles,
        totalParts,
        radius,
        outerRadius,
        minComponentLayout,
        centerComponentLayout,
      }),
    [
      index,
      componentAngles,
      sectorAngles,
      totalParts,
      radius,
      outerRadius,
      minComponentLayout,
      centerComponentLayout,
    ]
  );

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
    radius: outerRadius ?? radius,
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
