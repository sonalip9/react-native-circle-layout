import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import * as React from 'react';
import { StyleSheet, Text, View as RNView } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { CircleLayout } from 'react-native-circle-layout';

import { AnimView } from '../AnimatedComponents';

import { CircleBadge, View } from '../design_system/atoms';
import { ScreenHeader } from '../design_system/molecules';
import { useShowOnMount } from '../hooks/useShowOnMount';

const COLORS: { name: string; hex: string; icon: AntDesignIconName }[] = [
  { name: 'Red', hex: '#ef4444', icon: 'heart' },
  { name: 'Orange', hex: '#f97316', icon: 'fire' },
  { name: 'Yellow', hex: '#eab308', icon: 'star' },
  { name: 'Green', hex: '#22c55e', icon: 'like' },
  { name: 'Teal', hex: '#14b8a6', icon: 'trophy' },
  { name: 'Blue', hex: '#3b82f6', icon: 'cloud' },
  { name: 'Indigo', hex: '#6366f1', icon: 'rocket' },
  { name: 'Purple', hex: '#a855f7', icon: 'experiment' },
  { name: 'Pink', hex: '#ec4899', icon: 'gift' },
  { name: 'Rose', hex: '#f43f5e', icon: 'customer-service' },
];

const RADIUS = 130;
const SNAP_ANGLE = (2 * Math.PI) / COLORS.length;
const TWO_PI = 2 * Math.PI;

/**
 * Normalizes an angle to the range [0, 2π).
 * @param angle The angle to normalize.
 * @returns The normalized angle in the range [0, 2π).
 */
function normalizeAngle(angle: number): number {
  'worklet';

  return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
}

/**
 * Snaps the given angle to the nearest increment defined by SNAP_ANGLE.
 * @param angle The angle to snap to the nearest increment.
 * @returns The snapped angle.
 */
function nearestSnap(angle: number): number {
  'worklet';
  return Math.round(angle / SNAP_ANGLE) * SNAP_ANGLE;
}

/**
 * Finds the nearest equivalent angle to the target angle relative to the reference angle.
 * @param target The target angle.
 * @param reference The reference angle.
 * @returns The nearest equivalent angle to the target relative to the reference.
 */
function nearestEquivalentAngle(target: number, reference: number): number {
  'worklet';
  const diff = target - reference;
  return reference + diff - TWO_PI * Math.round(diff / TWO_PI);
}

const WHEEL_SIZE = RADIUS * 2 + 84;
const WHEEL_CENTER = WHEEL_SIZE / 2;

/**
 * Calculates the angle of the point (x, y) relative to the center of the wheel.
 * @param x The x-coordinate of the point.
 * @param y The y-coordinate of the point.
 * @returns The angle in radians relative to the center of the wheel.
 */
function angleAt(x: number, y: number): number {
  'worklet';
  return Math.atan2(y - WHEEL_CENTER, x - WHEEL_CENTER);
}

const GestureSelector = () => {
  const rotation = useSharedValue(0);
  const lastAngle = useSharedValue(0);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const circleLayoutRef = useShowOnMount();

  const updateSelected = React.useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  useDerivedValue(() => {
    const normalized = normalizeAngle(-rotation.value - Math.PI);
    const idx = Math.round(normalized / SNAP_ANGLE) % COLORS.length;
    scheduleOnRN(updateSelected, idx);
  });

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onBegin((e) => {
      lastAngle.value = angleAt(e.x, e.y);
    })
    .onUpdate((e) => {
      const current = angleAt(e.x, e.y);
      let delta = current - lastAngle.value;
      delta -= TWO_PI * Math.round(delta / TWO_PI);
      rotation.value += delta;
      lastAngle.value = current;
    })
    .onEnd(() => {
      const snapped = nearestSnap(rotation.value);
      rotation.value = withSpring(snapped, { damping: 20, stiffness: 150 });
    });

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}rad` }],
  }));

  const iconCounterStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotation.value}rad` }],
  }));

  const selectGesture = React.useCallback(
    (index: number) =>
      Gesture.Tap().onEnd(() => {
        const target = -index * SNAP_ANGLE - Math.PI;
        const nearest = nearestEquivalentAngle(target, rotation.value);
        rotation.value = withSpring(nearest, { damping: 20, stiffness: 150 });
      }),
    [rotation]
  );

  const selected = COLORS[selectedIndex]!;

  return (
    <View flex={1}>
      <ScreenHeader
        title="Color Wheel Selector"
        subtitle="CircleLayout + gesture rotation · Snaps to nearest"
      />

      <View flex={1} alignItems="center" justifyContent="center">
        <RNView style={styles.selectionIndicator}>
          <RNView style={styles.arrowDown} />
        </RNView>

        <GestureDetector gesture={panGesture}>
          <RNView style={styles.wheel}>
            <AnimView style={[styles.wheelInner, wheelStyle]}>
              <CircleLayout
                components={COLORS.map((color, index) => (
                  <GestureDetector
                    key={color.name}
                    gesture={selectGesture(index)}
                  >
                    <CircleBadge size={44} color={color.hex} shadow="item">
                      <AnimView style={iconCounterStyle}>
                        <AntDesign name={color.icon} size={20} color="#fff" />
                      </AnimView>
                    </CircleBadge>
                  </GestureDetector>
                ))}
                radius={RADIUS}
                startAngle={-Math.PI / 2}
                ref={circleLayoutRef}
              />
            </AnimView>
          </RNView>
        </GestureDetector>

        <RNView style={styles.selectedCard}>
          <CircleBadge
            size={60}
            color={selected.hex}
            shadow="fab"
            shadowColor="#000"
            style={styles.selectedSwatchShadow}
          />
          <Text style={styles.selectedName}>{selected.name}</Text>
          <Text style={styles.hexText}>{selected.hex}</Text>
        </RNView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    top: '14%',
    zIndex: 10,
    alignItems: 'center',
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#6366f1',
  },
  selectedCard: {
    marginTop: 30,
    alignItems: 'center',
    gap: 8,
  },
  selectedSwatchShadow: {
    shadowOpacity: 0.3,
    elevation: 6,
  },
  selectedName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B0B0B',
  },
  hexText: {
    fontFamily: 'monospace',
    color: '#9E9E9E',
    fontSize: 14,
  },
});

export default GestureSelector;
