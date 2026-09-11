import { AntDesign } from '@react-native-vector-icons/ant-design';
import * as React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View as RNView,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { AnimationType, CircleLayout } from 'react-native-circle-layout';

import { AnimView } from '../AnimatedComponents';
import { parallelAnimation } from '../utils/animationPresets';
import { ScreenHeader } from '@/design_system/molecules';

const TITLES = [
  'Sunset Drive',
  'Nueva Familia',
  'Harbour Lights',
  'Desert Run',
  'First Snow',
  'Rooftop Party',
  'Coast Road',
  'Studio Days',
  'Night Market',
  'Old Town',
  'Lake House',
  'Morning Fog',
  'Summer Camp',
  'City Rain',
  'Field Notes',
  'Long Weekend',
  'Backyard',
  'Train Window',
  'Winter Trail',
  'Festival',
  'Low Tide',
  'Garden Party',
  'Road Trip',
  'Last Light',
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const ALBUMS = TITLES.map((title, index) => ({
  title,
  date: `${MONTHS[index % MONTHS.length]} ${2022 + (index % 4)}`,
  photos: 8 + ((index * 7) % 40),
  hue: Math.round((index * 360) / TITLES.length),
}));

const COUNT = ALBUMS.length;
const STEP = (2 * Math.PI) / COUNT;
const TWO_PI = 2 * Math.PI;

// The wheel is deliberately larger than the viewport: only the slice of arc
// that fits on screen is visible, so the reel reads as a band that runs off
// the top and bottom edges — the rest keeps turning out of sight.
const RADIUS = 290;
// Each album is an annular sector of a band centred on RADIUS; the focused one
// swells outwards by EXPAND.
const BAND = 84;
const EXPAND = 20;
const FOCUS_EDGE = BAND / 2 + EXPAND;
const WHEEL_SIZE = RADIUS * 2 + BAND * 2;

// A second, much larger ring of hairlines. Each one is placed half a slot off
// the tiles, so they land on the boundaries between slots and fan outwards
// across the screen — the wedge they open up is where the callout sits.
const RAY_W = 620;
const RAY_RADIUS = RADIUS + FOCUS_EDGE + 18 + RAY_W / 2;

// The arc's rightmost point — the focus slot — sits this far from the left
// edge, which puts the circle's center off-canvas at FOCUS_X - RADIUS. A phone
// pulls it in so the callout still has room beside the reel.
const FOCUS_X = 120;
const FOCUS_X_COMPACT = 84;

// One slot of the reel, measured along the band, is also the height of one
// row of callout text — so the text scrolls at exactly the reel's pace.
const ROW_H = RADIUS * STEP;
const ARC_STROKE = 3;

// The strip is padded with a copy of the last album above and the first below,
// so there is always a neighbour to scroll in from either end.
const ROWS = [ALBUMS[COUNT - 1]!, ...ALBUMS, ALBUMS[0]!];

const ACCENT = '#29B6F6';
const SCREEN_BG = '#0B0F14';
const SNAP_SPRING = { damping: 22, stiffness: 140 };
const REEL_ANIMATION = parallelAnimation(
  { [AnimationType.OPACITY]: { duration: 420 } },
  16
);

/**
 * Snaps a wheel rotation to the nearest album slot.
 * @param angle The rotation, in radians.
 * @returns The rotation of the closest slot, in radians.
 */
function nearestSlot(angle: number): number {
  'worklet';
  return Math.round(angle / STEP) * STEP;
}

/**
 * Picks the representation of `target` that is closest to `reference`, so the
 * wheel takes the short way round instead of unwinding whole turns.
 * @param target The angle to move to, in radians.
 * @param reference The angle the wheel is resting at, in radians.
 * @returns The equivalent of `target` nearest to `reference`, in radians.
 */
function nearestEquivalentAngle(target: number, reference: number): number {
  'worklet';
  const diff = target - reference;
  return reference + diff - TWO_PI * Math.round(diff / TWO_PI);
}

/**
 * One hairline of the fan, fading out as it runs away from the reel.
 * @param props The properties passed to the component.
 * @param props.index The slot boundary this hairline sits on.
 * @param props.focused Whether it borders the focused slot.
 * @returns A radial hairline that fades towards the screen edge.
 */
const Ray = ({ index, focused }: { index: number; focused: boolean }) => {
  const color = focused ? '#6E8091' : '#3F4C59';
  const gradientId = `ray${index}`;

  return (
    <RNView
      style={{ transform: [{ rotate: `${STEP / 2 + index * STEP}rad` }] }}
    >
      <Svg width={RAY_W} height={1}>
        <Defs>
          <LinearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2={RAY_W}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor={color} stopOpacity={0.95} />
            <Stop offset="0.45" stopColor={color} stopOpacity={0.4} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={RAY_W}
          height={1}
          fill={`url(#${gradientId})`}
        />
      </Svg>
    </RNView>
  );
};

/**
 * One album's line of callout text, fading out as its slot leaves the wedge.
 * @param props The properties passed to the component.
 * @param props.album The album this row describes.
 * @param props.row The row's position in the padded strip.
 * @param props.rotation The reel's rotation, in radians.
 * @returns A row that dims with its distance from the focus point.
 */
const CalloutRow = ({
  album,
  row,
  rotation,
}: {
  album: (typeof ALBUMS)[number];
  row: number;
  rotation: SharedValue<number>;
}) => {
  const style = useAnimatedStyle(() => {
    const period = COUNT * ROW_H;
    const offset = (((-rotation.value * RADIUS) % period) + period) % period;
    const distance = Math.abs((row - 1) * ROW_H - offset);
    return { opacity: Math.max(0, 1 - distance / (ROW_H * 1.15)) };
  });

  return (
    <AnimView style={[styles.row, style]}>
      <Text style={styles.calloutTitle} numberOfLines={1}>
        {album.title.toUpperCase()}
      </Text>
      <Text style={styles.calloutDate} numberOfLines={1}>
        {album.date} · {album.photos} photos
      </Text>
      <RNView style={styles.calloutActions}>
        <AntDesign name="heart" size={14} color="#5C6672" />
        <AntDesign name="info-circle" size={14} color="#5C6672" />
        <AntDesign name="share-alt" size={14} color="#5C6672" />
      </RNView>
    </AnimView>
  );
};

const MediaReel = () => {
  const { width: windowWidth } = useWindowDimensions();
  const compact = windowWidth < 500;
  const focusX = compact ? FOCUS_X_COMPACT : FOCUS_X;
  const centerX = focusX - RADIUS;
  const rotation = useSharedValue(0);
  const rotationStart = useSharedValue(0);
  const stageHeight = useSharedValue(0);
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const wheelShift = windowWidth / 2 - centerX;

  const updateFocused = React.useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  useDerivedValue(() => {
    const slot = Math.round(-rotation.value / STEP) % COUNT;
    scheduleOnRN(updateFocused, (slot + COUNT) % COUNT);
  });

  const panGesture = Gesture.Pan()
    .minDistance(4)
    .onBegin(() => {
      rotationStart.value = rotation.value;
    })
    .onUpdate((e) => {
      // Drag distance along the reel converts to arc length: θ = s / r.
      rotation.value = rotationStart.value + e.translationY / RADIUS;
    })
    // onFinalize rather than onEnd: the reel must settle on a slot even when
    // the gesture is cancelled rather than cleanly ended.
    .onFinalize((e) => {
      const projected = rotation.value + (e.velocityY / RADIUS) * 0.12;
      rotation.value = withSpring(nearestSlot(projected), SNAP_SPRING);
    });

  // Tapping the stage brings the nearest slot to the focus point: the tap's
  // angle around the (off-canvas) center identifies the slot, so no per-tile
  // press handler is needed.
  const tapGesture = Gesture.Tap().onEnd((e) => {
    const angle = Math.atan2(e.y - stageHeight.value / 2, e.x - centerX);
    const slot = Math.round((angle - rotation.value) / STEP);
    rotation.value = withSpring(
      nearestEquivalentAngle(-slot * STEP, rotation.value),
      SNAP_SPRING
    );
  });

  const stageGesture = Gesture.Exclusive(panGesture, tapGesture);

  // The shift has to live in the animated transform too: a style array does
  // not merge `transform`, the last one wins.
  const wheelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -wheelShift },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  // The callout hangs off the reel at a fixed distance, so its highlight can
  // be struck from the wheel's own centre — concentric with the sector edge it
  // sits beside, which is what keeps the two arcs parallel.
  const calloutLeft = focusX + FOCUS_EDGE + (compact ? 18 : 30);
  const arcRadius = calloutLeft - centerX;
  // The wedge is narrowest at the callout's inner edge, so sizing the window
  // there keeps the text clear of both rays all the way out.
  const windowH = Math.round(2 * arcRadius * Math.tan(STEP / 2));
  const arcBulge =
    Math.ceil(arcRadius - Math.sqrt(arcRadius ** 2 - (windowH / 2) ** 2)) +
    ARC_STROKE;

  const stripStyle = useAnimatedStyle(() => {
    const period = COUNT * ROW_H;
    const offset = (((-rotation.value * RADIUS) % period) + period) % period;
    return {
      transform: [{ translateY: (windowH - ROW_H) / 2 - ROW_H - offset }],
    };
  });

  return (
    <RNView style={styles.screen}>
      <ScreenHeader
        title="Media Reel"
        subtitle="An off-canvas wheel cropped to the screen edge — drag to spin it, or tap to bring a slot to the focus point."
        isDarkMode
      />

      <RNView style={styles.body}>
        <GestureDetector gesture={stageGesture}>
          <RNView
            style={styles.stage}
            onLayout={(e) => {
              stageHeight.value = e.nativeEvent.layout.height;
            }}
          >
            <AnimView style={[styles.wheel, wheelStyle]}>
              {/* Both rings share one center and one rotation: the hairlines
                  sweep with the reel they belong to. */}
              <RNView style={styles.ring}>
                <CircleLayout
                  visible
                  radius={RAY_RADIUS}
                  startAngle={Math.PI + STEP / 2}
                  animationProps={REEL_ANIMATION}
                  components={ALBUMS.map((album, index) => (
                    <Ray
                      key={album.title}
                      index={index}
                      focused={
                        index === focusedIndex ||
                        index === (focusedIndex + COUNT - 1) % COUNT
                      }
                    />
                  ))}
                />
              </RNView>

              <RNView style={styles.ring}>
                <CircleLayout
                  visible
                  radius={RADIUS}
                  // CircleLayout mirrors its placement through the center, so
                  // a startAngle of π puts item 0 at the arc's rightmost point.
                  startAngle={Math.PI}
                  animationProps={REEL_ANIMATION}
                  // The albums themselves are the library's background
                  // sectors: one annular slice each, the focused one expanded.
                  bgConfig={{
                    color: (index) =>
                      `hsl(${ALBUMS[index]!.hue}, 48%, ${
                        index === focusedIndex ? 50 : 34
                      }%)`,
                    strokeColor: (index) =>
                      index === focusedIndex ? ACCENT : SCREEN_BG,
                    strokeWidth: (index) => (index === focusedIndex ? 2 : 3),
                    innerRadius: RADIUS - BAND / 2,
                    outerRadius: RADIUS + BAND / 2,
                    selectedIndex: focusedIndex,
                    expandedOuterRadius: RADIUS + FOCUS_EDGE,
                  }}
                  components={ALBUMS.map((album) => (
                    <RNView
                      key={album.title}
                      style={[
                        styles.sun,
                        {
                          backgroundColor: `hsl(${
                            (album.hue + 40) % 360
                          }, 72%, 70%)`,
                        },
                      ]}
                    />
                  ))}
                />
              </RNView>
            </AnimView>
          </RNView>
        </GestureDetector>

        {/* Sits in the wedge the two focused hairlines open up. */}
        <RNView
          style={[
            styles.callout,
            { left: calloutLeft, height: windowH, marginTop: -windowH / 2 },
          ]}
          pointerEvents="box-none"
        >
          <RNView style={[styles.arcClip, { width: arcBulge }]}>
            <RNView
              style={[
                styles.arc,
                {
                  width: arcRadius * 2,
                  height: arcRadius * 2,
                  borderRadius: arcRadius,
                  top: windowH / 2 - arcRadius,
                },
              ]}
            />
          </RNView>

          <RNView style={styles.textWindow}>
            <AnimView style={stripStyle}>
              {ROWS.map((album, row) => (
                <CalloutRow
                  key={`${album.title}-${row}`}
                  album={album}
                  row={row}
                  rotation={rotation}
                />
              ))}
            </AnimView>
          </RNView>

          <Pressable style={[styles.play, compact && styles.playCompact]}>
            <AntDesign
              name="caret-right"
              size={compact ? 22 : 26}
              color={SCREEN_BG}
            />
          </Pressable>
        </RNView>
      </RNView>
    </RNView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
  body: {
    flex: 1,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sun: {
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.9,
  },
  callout: {
    position: 'absolute',
    right: 12,
    maxWidth: 320,
    top: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  // A sliver of a circle struck from the wheel's own centre, so the highlight
  // runs parallel to the sector edge beside it.
  arcClip: {
    height: '100%',
    overflow: 'hidden',
  },
  arc: {
    position: 'absolute',
    right: 0,
    borderWidth: ARC_STROKE,
    borderColor: ACCENT,
  },
  textWindow: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  row: {
    height: ROW_H,
    justifyContent: 'center',
    gap: 1,
  },
  calloutTitle: {
    color: '#ECEFF1',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  calloutDate: {
    color: '#C3CBD4',
    fontSize: 12,
  },
  calloutActions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 4,
  },
  playCompact: {
    width: 44,
    height: 44,
  },
  play: {
    width: 52,
    height: 52,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT,
  },
});

export default MediaReel;
