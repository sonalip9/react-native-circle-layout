import { Animated } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';

import { rnAnimatedDriver } from '../animation/rnAnimatedDriver';
import { Bg } from '../Bg';
import { CircleLayoutContext } from '../CircleLayoutContext';
import { VisibilityContext } from '../VisibilityContext';
import {
  AnimationCombinationType,
  AnimationType,
  type CircleLayoutContextType,
  type Layout,
} from '../types';

const baseContext: CircleLayoutContextType = {
  totalParts: 3,
  radius: 100,
  startAngle: 0,
  sectorAngles: Array(3).fill((2 * Math.PI) / 3),
  componentAngles: [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3],
  animationDriver: rnAnimatedDriver,
};

const zeroLayout: Layout = { width: 0, height: 0 };

// Path tokens: M cx cy L sx sy A rx ry rot largeArc sweep ex ey Z
const localAngleDeg = (nums: number[], point: 'start' | 'end'): number => {
  const [cx, cy, sx, sy, , , , , , ex, ey] = nums;
  const [px, py] = point === 'start' ? [sx!, sy!] : [ex!, ey!];
  return ((Math.atan2(py - cy!, px - cx!) * 180) / Math.PI + 360) % 360;
};

const renderBg = (
  overrides: Partial<{
    index: number;
    radius: number;
    minComponentLayout: Layout;
    centerComponentLayout: Layout;
    color: string;
    strokeColor: string;
    strokeWidth: number;
    outerRadius: number;
    innerRadius: number;
    selectedIndex: number;
    expandedOuterRadius: number;
    onSectorPress: (index: number) => void;
    ctx: CircleLayoutContextType;
    visible: boolean;
  }> = {}
) => {
  const ctx = overrides.ctx ?? baseContext;
  return render(
    <CircleLayoutContext value={ctx}>
      <VisibilityContext value={overrides.visible ?? true}>
        <Bg
          index={overrides.index ?? 0}
          radius={overrides.radius ?? 100}
          minComponentLayout={overrides.minComponentLayout ?? zeroLayout}
          centerComponentLayout={overrides.centerComponentLayout ?? zeroLayout}
          color={overrides.color}
          strokeColor={overrides.strokeColor}
          strokeWidth={overrides.strokeWidth}
          outerRadius={overrides.outerRadius}
          innerRadius={overrides.innerRadius}
          selectedIndex={overrides.selectedIndex}
          expandedOuterRadius={overrides.expandedOuterRadius}
          onSectorPress={overrides.onSectorPress}
        />
      </VisibilityContext>
    </CircleLayoutContext>
  );
};

describe('Bg', () => {
  describe('rendering', () => {
    it('renders one Svg element', async () => {
      const { getAllByTestId } = await renderBg();
      expect(getAllByTestId(/^circle-layout-bg-svg-/)).toHaveLength(1);
    });

    it('renders without throwing at index 0, 1, 2 of a 3-part context', async () => {
      await expect(renderBg({ index: 0 })).resolves.not.toThrow();
      await expect(renderBg({ index: 1 })).resolves.not.toThrow();
      await expect(renderBg({ index: 2 })).resolves.not.toThrow();
    });

    it('sets pointerEvents="box-none" on the Svg canvas so touches fall through to the Path', async () => {
      // Every sector's Svg canvas is sized/positioned identically (large
      // enough for the whole circle, not just its own wedge), so they fully
      // overlap. Without box-none, the topmost (last-rendered) sector's
      // canvas would claim every touch within that shared rectangle
      // regardless of which wedge was actually tapped.
      const { getByTestId } = await renderBg();
      expect(getByTestId(/^circle-layout-bg-svg-/).props.pointerEvents).toBe(
        'box-none'
      );
    });

    it('renders without throwing with a donut (innerRadius) config', async () => {
      await expect(
        renderBg({ innerRadius: 20, outerRadius: 80 })
      ).resolves.not.toThrow();
    });
  });

  describe('sector arc radius', () => {
    it('draws the sector arc at outerRadius, not at the padded canvas size', async () => {
      // minComponentLayout/centerComponentLayout differ, as they do once real
      // marker/center components have been measured, so the SVG canvas (size)
      // ends up padded larger than the configured outerRadius.
      const { getByTestId } = await renderBg({
        outerRadius: 100,
        minComponentLayout: { width: 37, height: 48 },
        centerComponentLayout: { width: 25, height: 25 },
        color: 'red',
      });

      const path = getByTestId(/^circle-layout-bg-path-/).props.d as string;
      const arcRadius = Number(path.split(' ')[7]);

      expect(arcRadius).toBeCloseTo(100);
    });

    it('falls back to radius when outerRadius is not provided', async () => {
      const { getByTestId } = await renderBg({
        radius: 80,
        minComponentLayout: { width: 37, height: 48 },
        centerComponentLayout: { width: 25, height: 25 },
        color: 'red',
      });

      const path = getByTestId(/^circle-layout-bg-path-/).props.d as string;
      const arcRadius = Number(path.split(' ')[7]);

      expect(arcRadius).toBeCloseTo(80);
    });
  });

  describe('visibility (via VisibilityContext)', () => {
    it('still mounts (does not unmount) when VisibilityContext is false', async () => {
      const { getAllByTestId } = await renderBg({ visible: false });
      expect(getAllByTestId(/^circle-layout-bg-svg-/)).toHaveLength(1);
    });

    it('does not throw when VisibilityContext value changes after mount', async () => {
      const context = baseContext;
      const { rerender, getAllByTestId } = await render(
        <CircleLayoutContext value={context}>
          <VisibilityContext value={true}>
            <Bg
              index={0}
              radius={100}
              minComponentLayout={zeroLayout}
              centerComponentLayout={zeroLayout}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );
      await expect(
        rerender(
          <CircleLayoutContext value={context}>
            <VisibilityContext value={false}>
              <Bg
                index={0}
                radius={100}
                minComponentLayout={zeroLayout}
                centerComponentLayout={zeroLayout}
              />
            </VisibilityContext>
          </CircleLayoutContext>
        )
      ).resolves.not.toThrow();
      expect(getAllByTestId(/^circle-layout-bg-svg-/)).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('renders with radius 0 without throwing', async () => {
      await expect(renderBg({ radius: 0 })).resolves.not.toThrow();
    });

    it('renders with non-zero minComponentLayout and centerComponentLayout without throwing', async () => {
      await expect(
        renderBg({
          minComponentLayout: { width: 40, height: 40 },
          centerComponentLayout: { width: 20, height: 20 },
        })
      ).resolves.not.toThrow();
    });
  });

  describe('wedge boundaries', () => {
    const pathNums = (result: Awaited<ReturnType<typeof renderBg>>): number[] =>
      (result.getByTestId(/^circle-layout-bg-path-/).props.d as string)
        .match(/-?[\d.]+/g)!
        .map(Number);

    it('keeps wedges gapless around the wrap for unequal weights on a complete circle', async () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        totalParts: 3,
        sectorAngles: [Math.PI, Math.PI / 2, Math.PI / 2],
        componentAngles: [0, Math.PI, (3 * Math.PI) / 2],
      };

      const first = pathNums(
        await renderBg({ ctx, index: 0, outerRadius: 100 })
      );
      const last = pathNums(
        await renderBg({ ctx, index: 2, outerRadius: 100 })
      );

      // The last wedge's end point must land exactly on the first wedge's
      // start point for the ring to be gapless/overlap-free at the wrap.
      const [, , firstStartX, firstStartY] = first;
      const [, , , , , , , , , lastEndX, lastEndY] = last;
      expect(lastEndX).toBeCloseTo(firstStartX!);
      expect(lastEndY).toBeCloseTo(firstStartY!);
    });

    it('does not wrap the first/last wedge of a partial arc across the sweep boundary', async () => {
      // 3 markers over a half-sweep: totalParts (2) !== sectorAngles.length
      // (3) marks this as a partial arc, same as CircleLayoutProvider
      // produces for sweepAngle < 2π.
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        totalParts: 2,
        sectorAngles: Array(3).fill(Math.PI / 2),
        componentAngles: [0, Math.PI / 2, Math.PI],
      };

      const first = pathNums(
        await renderBg({ ctx, index: 0, outerRadius: 100 })
      );
      const last = pathNums(
        await renderBg({ ctx, index: 2, outerRadius: 100 })
      );

      // First wedge's start must sit at its own (un-centered) marker angle
      // (0 rad -> 180 deg once rendered), not wrapped backward using the
      // trailing sector's width.
      expect(localAngleDeg(first, 'start')).toBeCloseTo(180, 1);
      // Last wedge's end must reach the full sweep width forward
      // (angle[2] + sectorAngles[2] = 3π/2 rad -> 90 deg once rendered),
      // not stop halfway as it would if centered on a nonexistent neighbor.
      expect(localAngleDeg(last, 'end')).toBeCloseTo(90, 1);
    });
  });

  describe('selection / expand-on-select', () => {
    it('draws the sector arc at outerRadius when not the selected index', async () => {
      const { getByTestId } = await renderBg({
        index: 1,
        outerRadius: 100,
        expandedOuterRadius: 150,
        selectedIndex: 0,
      });

      const path = getByTestId(/^circle-layout-bg-path-/).props.d as string;
      const arcRadius = Number(path.split(' ')[7]);

      expect(arcRadius).toBeCloseTo(100);
    });

    it('draws the selected sector arc at expandedOuterRadius', async () => {
      const { getByTestId } = await renderBg({
        index: 0,
        outerRadius: 100,
        expandedOuterRadius: 150,
        selectedIndex: 0,
      });

      const path = getByTestId(/^circle-layout-bg-path-/).props.d as string;
      const arcRadius = Number(path.split(' ')[7]);

      expect(arcRadius).toBeCloseTo(150);
    });

    it('smoothly retargets (not snaps) the animated radius node towards expandedOuterRadius on selection change', async () => {
      jest.useFakeTimers();
      const timingSpy = jest.spyOn(Animated, 'timing');
      const ctx = baseContext;
      const { rerender } = await render(
        <CircleLayoutContext value={ctx}>
          <VisibilityContext value={true}>
            <Bg
              index={0}
              radius={100}
              minComponentLayout={zeroLayout}
              centerComponentLayout={zeroLayout}
              outerRadius={100}
              expandedOuterRadius={150}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );

      expect(timingSpy).not.toHaveBeenCalled();

      await act(async () => {
        await rerender(
          <CircleLayoutContext value={ctx}>
            <VisibilityContext value={true}>
              <Bg
                index={0}
                radius={100}
                minComponentLayout={zeroLayout}
                centerComponentLayout={zeroLayout}
                outerRadius={100}
                expandedOuterRadius={150}
                selectedIndex={0}
              />
            </VisibilityContext>
          </CircleLayoutContext>
        );
      });

      // Retargeting an already-mounted sector's radius runs an actual timing
      // animation (toValue 150) rather than jumping straight to the value,
      // as would happen if the radius were just a plain re-rendered prop.
      expect(timingSpy).toHaveBeenCalledWith(
        expect.any(Animated.Value),
        expect.objectContaining({ toValue: 150 })
      );

      await act(() => {
        jest.runAllTimers();
      });

      timingSpy.mockRestore();
      jest.useRealTimers();
    });

    it('does not re-trigger the retargeting animation on unrelated re-renders', async () => {
      const timingSpy = jest.spyOn(Animated, 'timing');
      const ctx = baseContext;
      const { rerender } = await render(
        <CircleLayoutContext value={ctx}>
          <VisibilityContext value={true}>
            <Bg
              index={0}
              radius={100}
              minComponentLayout={zeroLayout}
              centerComponentLayout={zeroLayout}
              outerRadius={100}
              expandedOuterRadius={150}
              selectedIndex={0}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );

      await rerender(
        <CircleLayoutContext value={ctx}>
          <VisibilityContext value={true}>
            <Bg
              index={0}
              radius={100}
              minComponentLayout={zeroLayout}
              centerComponentLayout={zeroLayout}
              outerRadius={100}
              expandedOuterRadius={150}
              selectedIndex={0}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );

      expect(timingSpy).not.toHaveBeenCalled();
      timingSpy.mockRestore();
    });

    it('does not throw when selectedIndex is set without expandedOuterRadius', async () => {
      await expect(
        renderBg({ index: 0, selectedIndex: 0, outerRadius: 100 })
      ).resolves.not.toThrow();
    });

    it('calls onSectorPress with its own index when the wedge is pressed', async () => {
      const onSectorPress = jest.fn();
      const { getByTestId } = await renderBg({ index: 2, onSectorPress });

      await fireEvent.press(getByTestId(/^circle-layout-bg-path-/));

      expect(onSectorPress).toHaveBeenCalledWith(2);
    });

    it('does not set an onPress handler when onSectorPress is not provided', async () => {
      const { getByTestId } = await renderBg({ index: 0 });
      expect(
        getByTestId(/^circle-layout-bg-path-/).props.onPress
      ).toBeUndefined();
    });

    it('draws at the real outerRadius (not collapsed to a point) when CIRCULAR animation makes endAngle an animated node too', async () => {
      // Regression: when expandedOuterRadius makes radius an animated node
      // AND a CIRCULAR animationConfig makes endAngle an animated node too,
      // useAnimatedSectorPath tracks both via addValueListener rather than
      // reading them synchronously. A listener only fires on an actual
      // value change, so without seeding it at mount the sector rendered
      // collapsed (radius/angle stuck at their internal 0 placeholders)
      // until (if ever) a real selection change first animates the node.
      jest.useFakeTimers();
      const ctxWithCircular: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: {
            [AnimationType.CIRCULAR]: { duration: 300 },
          },
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };

      const { getByTestId } = await renderBg({
        ctx: ctxWithCircular,
        index: 0,
        outerRadius: 100,
        expandedOuterRadius: 150,
      });

      const path = getByTestId(/^circle-layout-bg-path-/).props.d as string;
      const arcRadius = Number(path.split(' ')[7]);

      expect(arcRadius).toBeCloseTo(100);

      await act(() => {
        jest.runAllTimers();
      });
      jest.useRealTimers();
    });

    it('stays non-degenerate after a real selection change with CIRCULAR animation configured', async () => {
      // Regression: the seeding above only covers the state right after
      // useAnimatedSectorPath's listeners are first registered. Once a real
      // retarget follows (a later selection change), the radius node's
      // listener must keep tracking correctly rather than collapsing again.
      jest.useFakeTimers();
      const ctxWithCircular: CircleLayoutContextType = {
        ...baseContext,
        animationProps: {
          animationConfigs: {
            [AnimationType.CIRCULAR]: { duration: 300 },
          },
          animationCombinationType: AnimationCombinationType.PARALLEL,
        },
      };

      const { rerender, getByTestId } = await render(
        <CircleLayoutContext value={ctxWithCircular}>
          <VisibilityContext value={true}>
            <Bg
              index={0}
              radius={100}
              minComponentLayout={zeroLayout}
              centerComponentLayout={zeroLayout}
              outerRadius={100}
              expandedOuterRadius={150}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );

      await act(async () => {
        await rerender(
          <CircleLayoutContext value={ctxWithCircular}>
            <VisibilityContext value={true}>
              <Bg
                index={0}
                radius={100}
                minComponentLayout={zeroLayout}
                centerComponentLayout={zeroLayout}
                outerRadius={100}
                expandedOuterRadius={150}
                selectedIndex={0}
              />
            </VisibilityContext>
          </CircleLayoutContext>
        );
      });

      await act(() => {
        jest.runAllTimers();
      });

      const path = getByTestId(/^circle-layout-bg-path-/).props.d as string;
      const arcRadius = Number(path.split(' ')[7]);

      expect(arcRadius).toBeCloseTo(150);
      jest.useRealTimers();
    });

    it('stays within [outerRadius, expandedOuterRadius] while collapsing back after deselection', async () => {
      // Regression: maxRadius (the interpolation domain fed to
      // useAnimatedSectorPath) was being set to targetOuterRadius, the
      // *current* selection target. On deselect that target drops back to
      // the small outerRadius, but the animated node is still transiently
      // passing through larger values on its way down from
      // expandedOuterRadius — those samples land outside the narrowed
      // domain and get linearly extrapolated into a bogus radius.
      jest.useFakeTimers();

      const { rerender, getByTestId } = await render(
        <CircleLayoutContext value={baseContext}>
          <VisibilityContext value={true}>
            <Bg
              index={0}
              radius={100}
              minComponentLayout={zeroLayout}
              centerComponentLayout={zeroLayout}
              outerRadius={100}
              expandedOuterRadius={150}
              selectedIndex={0}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );

      await act(() => {
        jest.runAllTimers();
      });

      await act(async () => {
        await rerender(
          <CircleLayoutContext value={baseContext}>
            <VisibilityContext value={true}>
              <Bg
                index={0}
                radius={100}
                minComponentLayout={zeroLayout}
                centerComponentLayout={zeroLayout}
                outerRadius={100}
                expandedOuterRadius={150}
                selectedIndex={undefined}
              />
            </VisibilityContext>
          </CircleLayoutContext>
        );
      });

      await act(() => {
        jest.advanceTimersByTime(250);
      });

      const midPath = getByTestId(/^circle-layout-bg-path-/).props.d as string;
      const midArcRadius = Number(midPath.split(' ')[7]);

      expect(midArcRadius).toBeGreaterThanOrEqual(100);
      expect(midArcRadius).toBeLessThanOrEqual(150);

      await act(() => {
        jest.runAllTimers();
      });

      const finalPath = getByTestId(/^circle-layout-bg-path-/).props
        .d as string;
      const finalArcRadius = Number(finalPath.split(' ')[7]);

      expect(finalArcRadius).toBeCloseTo(100);
      jest.useRealTimers();
    });

    it('keeps the SVG canvas size stable across select/deselect instead of snapping to the new target instantly', async () => {
      // Regression: the canvas (Svg width/height, and the center point paths
      // are built around) was sized from targetOuterRadius, the *current*
      // selection target, which changes the instant selection changes — a
      // full render tick before the animated radius node has moved at all.
      // On deselect this shrunk the canvas out from under the still-large
      // painted sector, clipping it until the (separately animating) radius
      // caught down to fit. Sizing the canvas to the sector's constant peak
      // radius instead means it never has to resize as selection changes.
      const { rerender, getByTestId } = await render(
        <CircleLayoutContext value={baseContext}>
          <VisibilityContext value={true}>
            <Bg
              index={0}
              radius={100}
              minComponentLayout={zeroLayout}
              centerComponentLayout={zeroLayout}
              outerRadius={100}
              expandedOuterRadius={150}
              selectedIndex={undefined}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );

      const sizeBeforeSelect = getByTestId(/^circle-layout-bg-svg-/).props
        .width as number;

      await rerender(
        <CircleLayoutContext value={baseContext}>
          <VisibilityContext value={true}>
            <Bg
              index={0}
              radius={100}
              minComponentLayout={zeroLayout}
              centerComponentLayout={zeroLayout}
              outerRadius={100}
              expandedOuterRadius={150}
              selectedIndex={0}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );

      const sizeAfterSelect = getByTestId(/^circle-layout-bg-svg-/).props
        .width as number;

      await rerender(
        <CircleLayoutContext value={baseContext}>
          <VisibilityContext value={true}>
            <Bg
              index={0}
              radius={100}
              minComponentLayout={zeroLayout}
              centerComponentLayout={zeroLayout}
              outerRadius={100}
              expandedOuterRadius={150}
              selectedIndex={undefined}
            />
          </VisibilityContext>
        </CircleLayoutContext>
      );

      const sizeAfterDeselect = getByTestId(/^circle-layout-bg-svg-/).props
        .width as number;

      expect(sizeAfterSelect).toBe(sizeBeforeSelect);
      expect(sizeAfterDeselect).toBe(sizeBeforeSelect);
    });
  });
});
