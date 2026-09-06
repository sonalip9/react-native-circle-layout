import Svg, { Path } from 'react-native-svg';
import type { ResolvedBgConfig, Layout } from './types';
import {
  use,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  selectedIndex,
  expandedOuterRadius,
  onSectorPress,
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

  const isSelected = selectedIndex === index;
  const canExpand = expandedOuterRadius !== undefined;
  const targetOuterRadius =
    isSelected && canExpand ? expandedOuterRadius : (outerRadius ?? radius);

  const { startAngleInRadians, endAngleInRadians, size, center } = useMemo(
    () =>
      resolveBgGeometry({
        index,
        componentAngles,
        sectorAngles,
        totalParts,
        radius,
        outerRadius: targetOuterRadius,
        minComponentLayout,
        centerComponentLayout,
      }),
    [
      index,
      componentAngles,
      sectorAngles,
      totalParts,
      radius,
      targetOuterRadius,
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
    radius: targetOuterRadius,
    useNativeDriver: false,
  });

  useLayoutEffect(() => {
    if (isVisible) {
      showComponent();
    } else {
      hideComponent();
    }
  }, [hideComponent, isVisible, showComponent]);

  // A dedicated animated value that smoothly retargets the outer radius on
  // selection change. `radiusValue` (from useCombinedAnimation) only snaps
  // to prop changes outside of its own entry/exit animation lifecycle, so
  // selection-driven expansion needs its own animation, kept separate from
  // (and only used instead of) the entry/exit radius animation. Used
  // whenever `canExpand` (an `expandedOuterRadius` is configured) — for
  // every sector in that bgConfig, not just whichever one ends up selected.
  // As a consequence, every such sector starts directly at its resting
  // outer radius rather than growing/sweeping in via a configured
  // LINEAR/CIRCULAR entry animation — see the seeding effect below.
  const [expandRadiusValue] = useState(() =>
    driver.createValue(targetOuterRadius)
  );
  const previousTargetOuterRadiusRef = useRef<number | undefined>(undefined);

  const path = useAnimatedSectorPath({
    driver,
    radius: canExpand ? expandRadiusValue : radiusValue,
    startAngle: startAngleInRadians,
    endAngle: radiansValue,
    center,
    innerRadius,
  });

  // Must run after the useAnimatedSectorPath call above. Once `canExpand`,
  // `radius` above is `expandRadiusValue`; if `radiansValue` is also an
  // animated node (a CIRCULAR entry animation is configured), that hook
  // tracks both via addValueListener rather than reading them
  // synchronously, and a listener only learns a value once something
  // actually calls setValue/timing on the node. The first time this effect
  // sees `canExpand`, it seeds both nodes directly to their resting
  // values — skipping (only for this sector) whatever LINEAR/CIRCULAR entry
  // animation would otherwise have played — so useAnimatedSectorPath's
  // listeners start from correct values instead of sitting on its internal
  // 0 placeholders. Effects run in hook-call order, so declaring this one
  // afterwards guarantees the hook's own listener-setup effect has already
  // registered those listeners by the time this seed fires.
  useEffect(() => {
    if (!canExpand) return;
    if (previousTargetOuterRadiusRef.current === undefined) {
      driver.setValue(expandRadiusValue, targetOuterRadius);
      if (driver.isAnimatedValue(radiansValue)) {
        driver.setValue(radiansValue, endAngleInRadians);
      }
    } else if (previousTargetOuterRadiusRef.current !== targetOuterRadius) {
      driver.start(
        driver.timing(expandRadiusValue, targetOuterRadius, {}, false)
      );
    }
    previousTargetOuterRadiusRef.current = targetOuterRadius;
  }, [
    canExpand,
    targetOuterRadius,
    driver,
    expandRadiusValue,
    radiansValue,
    endAngleInRadians,
  ]);

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
      // Every sector's canvas is sized/positioned identically (large enough
      // to fit the whole circle, not just this wedge), so they fully
      // overlap. Without this, the topmost (last-rendered) sector's canvas
      // would claim every touch within that shared bounding box regardless
      // of which wedge was actually tapped — RN's responder system hit-tests
      // a View's full layout rectangle, not the shape actually painted
      // inside it. `box-none` makes the canvas itself untouchable so a
      // touch falls through to whichever sector's `AnimatedPath` really
      // contains it.
      pointerEvents="box-none"
    >
      <AnimatedPath
        d={path as string}
        fill={color}
        stroke={strokeColor ?? color}
        strokeOpacity={0.5}
        strokeWidth={strokeWidth}
        opacity={opacityValue as number}
        onPress={onSectorPress ? () => onSectorPress(index) : undefined}
      />
    </AnimatedSvg>
  );
  /* eslint-enable react-hooks/static-components, @eslint-react/static-components -- end of the driver-dependent animated component region (see disable comment above AnimatedSvg/AnimatedPath). */
};
