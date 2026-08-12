import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View as RNView } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
  type CircleLayoutRef,
} from 'react-native-circle-layout';

import { AnimView } from '../AnimatedComponents';

import { View } from '../design_system/atoms';
import { ScreenHeader } from '../design_system/molecules';

const NAV_ITEMS: { icon: AntDesignIconName; label: string; color: string }[] = [
  { icon: 'home', label: 'Home', color: '#6366f1' },
  { icon: 'search', label: 'Search', color: '#3b82f6' },
  { icon: 'heart', label: 'Favorites', color: '#ec4899' },
  { icon: 'user', label: 'Profile', color: '#10b981' },
  { icon: 'setting', label: 'Settings', color: '#f59e0b' },
];

const RADIUS = 140;

const CircularNavMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const expanded = useSharedValue(0);
  const circleLayoutRef = React.useRef<CircleLayoutRef>(null);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    expanded.value = withSpring(next ? 1 : 0, {
      damping: 15,
      stiffness: 120,
      mass: 0.8,
    });
    if (next) {
      circleLayoutRef.current?.showComponents();
    } else {
      circleLayoutRef.current?.hideComponents();
    }
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expanded.value, [0, 1], [0, 0.5]),
  }));

  const fabRotation = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(expanded.value, [0, 1], [0, 45])}deg`,
      },
    ],
  }));

  return (
    <View flex={1}>
      <View flex={1}>
        <ScreenHeader
          title="Circular Navigation"
          subtitle="CircleLayout half-circle fan-out from bottom"
        />

        <RNView style={styles.pageContent}>
          <AntDesign name="home" size={48} color="#6366f1" />
          <Text style={styles.pageTitle}>Home</Text>
          <Text style={styles.subtitle}>Tap the + button below</Text>
        </RNView>
      </View>

      {isOpen && (
        <AnimView style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={toggle} />
        </AnimView>
      )}

      <CircleLayout
        components={NAV_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            style={[styles.navItemInner, { backgroundColor: item.color }]}
          >
            <AntDesign name={item.icon} size={22} color="#fff" />
            <Text style={styles.navLabel}>{item.label}</Text>
          </Pressable>
        ))}
        centerComponent={
          <RNView style={styles.fabContainer}>
            <Pressable onPress={toggle}>
              <AnimView style={[styles.fab, fabRotation]}>
                <AntDesign name="plus" size={28} color="#fff" />
              </AnimView>
            </Pressable>
          </RNView>
        }
        radius={RADIUS}
        sweepAngle={Math.PI}
        ref={circleLayoutRef}
        containerStyle={styles.menuContainer}
        animationProps={{
          animationCombinationType: AnimationCombinationType.SEQUENCE,
          animationGap: 50,
          animationConfigs: {
            [AnimationType.LINEAR]: { duration: 300 },
            [AnimationType.OPACITY]: { duration: 200 },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  pageContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0B0B',
    marginTop: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItemInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  navLabel: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  fabContainer: {
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default CircularNavMenu;
