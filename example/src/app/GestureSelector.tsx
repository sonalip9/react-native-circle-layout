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
  runOnJS,
} from 'react-native-reanimated';

import { CircleLayout, type CircleLayoutRef } from 'react-native-circle-layout';

import { AnimView } from '../AnimatedComponents';

import { View } from '../design_system/atoms';
import { ScreenHeader } from '../design_system/molecules';

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

/**
 * @param angle
 */
function normalizeAngle(angle: number): number {
  'worklet';
  const TWO_PI = 2 * Math.PI;
  return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
}

/**
 * @param angle
 */
function nearestSnap(angle: number): number {
  'worklet';
  return Math.round(angle / SNAP_ANGLE) * SNAP_ANGLE;
}

const GestureSelector = () => {
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const circleLayoutRef = React.useRef<CircleLayoutRef>(null);

  React.useEffect(() => {
    circleLayoutRef.current?.showComponents();
  }, []);

  const updateSelected = React.useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  useDerivedValue(() => {
    const normalized = normalizeAngle(-rotation.value - Math.PI);
    const idx = Math.round(normalized / SNAP_ANGLE) % COLORS.length;
    runOnJS(updateSelected)(idx);
  });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const velocity = Math.sqrt(
        e.velocityX * e.velocityX + e.velocityY * e.velocityY
      );
      const speedFactor = Math.min(velocity / 500, 3);
      rotation.value =
        savedRotation.value + e.translationX * 0.005 * speedFactor;
    })
    .onEnd(() => {
      const snapped = nearestSnap(rotation.value);
      rotation.value = withSpring(snapped, { damping: 20, stiffness: 150 });
      savedRotation.value = snapped;
    });

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}rad` }],
  }));

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
          <AnimView style={[styles.wheel, wheelStyle]}>
            <CircleLayout
              components={COLORS.map((color) => (
                <RNView
                  key={color.name}
                  style={[styles.colorItem, { backgroundColor: color.hex }]}
                >
                  <AntDesign name={color.icon} size={20} color="#fff" />
                </RNView>
              ))}
              radius={RADIUS}
              startAngle={-Math.PI / 2}
              ref={circleLayoutRef}
            />
          </AnimView>
        </GestureDetector>

        <RNView style={styles.selectedCard}>
          <RNView
            style={[styles.selectedSwatch, { backgroundColor: selected.hex }]}
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
    width: RADIUS * 2 + 84,
    height: RADIUS * 2 + 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectionIndicator: {
    position: 'absolute',
    top: '25%',
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
  selectedSwatch: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
