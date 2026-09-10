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
} from 'react-native-circle-layout';

import { AnimView } from '../AnimatedComponents';

import { CircleBadge, View } from '../design_system/atoms';
import { ScreenHeader } from '../design_system/molecules';
import { useCircleVisibilityRef } from '../hooks/useCircleVisibilityRef';

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
  const { ref: circleLayoutRef, show, hide } = useCircleVisibilityRef();

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    expanded.value = withSpring(next ? 1 : 0, {
      damping: 15,
      stiffness: 120,
      mass: 0.8,
    });
    if (next) {
      show();
    } else {
      hide();
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
          <Pressable key={item.label}>
            <CircleBadge size={50} color={item.color} shadow="item">
              <AntDesign name={item.icon} size={22} color="#fff" />
              <Text style={styles.navLabel}>{item.label}</Text>
            </CircleBadge>
          </Pressable>
        ))}
        centerComponent={
          <RNView style={styles.fabContainer}>
            <Pressable onPress={toggle}>
              <AnimView style={fabRotation}>
                <CircleBadge size={56} color="#6366f1" shadow="fab">
                  <AntDesign name="plus" size={28} color="#fff" />
                </CircleBadge>
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
  navLabel: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  fabContainer: {
    alignItems: 'center',
  },
});

export default CircularNavMenu;
