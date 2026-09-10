import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import { MotiPressable } from 'moti/interactions';
import * as React from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  FadeIn,
} from 'react-native-reanimated';

import {
  CircleLayout,
  AnimationCombinationType,
  AnimationType,
} from 'react-native-circle-layout';

import { AnimView } from '../AnimatedComponents';
import { DriverMetricsFooter, useMountedGuard } from '../DriverMetrics';
import { CircleBadge, View } from '../design_system/atoms';
import { ScreenHeader } from '../design_system/molecules';
import { useCircleVisibilityRef } from '../hooks/useCircleVisibilityRef';

const ICONS: { name: AntDesignIconName; color: string; label: string }[] = [
  { name: 'edit', color: '#f43f5e', label: 'Edit' },
  { name: 'camera', color: '#8b5cf6', label: 'Camera' },
  { name: 'heart', color: '#ec4899', label: 'Like' },
  { name: 'share-alt', color: '#3b82f6', label: 'Share' },
  { name: 'star', color: '#f59e0b', label: 'Favorite' },
  { name: 'setting', color: '#10b981', label: 'Settings' },
];

const RADIUS = 100;
const PRESS_SPRING = { damping: 15, stiffness: 200 };
const FAB_SPRING = { damping: 12, stiffness: 100 };

const METRICS_ITEMS = [
  { label: 'RN Animated', detail: '0 extra deps · built into react-native' },
  {
    label: 'Moti',
    detail:
      'moti@0.30.0 + react-native-reanimated@4.3.1 (peer dep, native module + Babel plugin)',
  },
];

// CircleLayout's own arrange/show/hide animation uses its default driver
// (RN Animated, native-driven) on both sections below — that part is
// identical either way. The comparison here is the per-item interaction
// layer stacked on top: plain RN Animated vs Moti/Reanimated worklets.
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const RnAnimatedItem = ({
  icon,
  onPress,
}: {
  icon: (typeof ICONS)[number];
  onPress: (label: string) => void;
}) => {
  const [scale] = React.useState(() => new Animated.Value(1));

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.85,
      useNativeDriver: true,
      ...PRESS_SPRING,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...PRESS_SPRING,
    }).start();
  };

  return (
    <AnimatedPressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={() => onPress(icon.label)}
      style={{ transform: [{ scale }] }}
    >
      <CircleBadge size={48} color={icon.color} shadow="item">
        <AntDesign name={icon.name} size={22} color="#fff" />
      </CircleBadge>
    </AnimatedPressable>
  );
};

const MotiItem = ({
  icon,
  onPress,
}: {
  icon: (typeof ICONS)[number];
  onPress: (label: string) => void;
}) => {
  return (
    <MotiPressable
      animate={({ pressed }) => {
        'worklet';
        return { scale: pressed ? 0.85 : 1 };
      }}
      transition={{ type: 'spring', ...PRESS_SPRING }}
      onPress={() => onPress(icon.label)}
    >
      <CircleBadge size={48} color={icon.color} shadow="item">
        <AntDesign name={icon.name} size={22} color="#fff" />
      </CircleBadge>
    </MotiPressable>
  );
};

const MotiIntegration = () => {
  const [visible, setVisible] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const {
    ref: rnCircleRef,
    show: showRn,
    hide: hideRn,
  } = useCircleVisibilityRef();
  const {
    ref: motiCircleRef,
    show: showMoti,
    hide: hideMoti,
  } = useCircleVisibilityRef();

  const [rnFabRotation] = React.useState(() => new Animated.Value(0));
  const motiFabRotation = useSharedValue(0);

  // Settle time for the one directly comparable async operation on this
  // screen: the FAB rotation spring, timed from trigger to completion
  // callback on both sides (RN Animated's `.start(cb)`, Reanimated's
  // `withSpring(..., cb)`). The press-scale items have no completion signal
  // to time (they animate back on release, not toward a fixed end state).
  const [rnFabSettleMs, setRnFabSettleMs] = React.useState<number | null>(null);
  const [motiFabSettleMs, setMotiFabSettleMs] = React.useState<number | null>(
    null
  );

  // The FAB spring can settle after the screen is navigated away from —
  // guard both completion callbacks against setting state post-unmount.
  const guard = useMountedGuard();

  const toggleMenu = () => {
    const next = !visible;
    setVisible(next);

    const rnStartedAt = Date.now();
    Animated.spring(rnFabRotation, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      ...FAB_SPRING,
    }).start(guard(() => setRnFabSettleMs(Date.now() - rnStartedAt)));

    const motiStartedAt = Date.now();
    motiFabRotation.value = withSpring(next ? 1 : 0, FAB_SPRING, (finished) => {
      // `guard` reads a plain JS ref: only safe to call once back on the JS
      // thread (inside the `runOnJS`-scheduled callback), not here in the
      // worklet — reading it directly on the UI thread isn't supported.
      if (finished) {
        runOnJS(guard(() => setMotiFabSettleMs(Date.now() - motiStartedAt)))();
      }
    });

    if (next) {
      showRn();
      showMoti();
    } else {
      hideRn();
      hideMoti();
    }
  };

  const rnFabStyle = {
    transform: [
      {
        rotate: rnFabRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const motiFabStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${motiFabRotation.value * 45}deg` }],
  }));

  const handleItemPress = (label: string) => {
    setSelectedLabel(label);
    setTimeout(() => setSelectedLabel(null), 1500);
  };

  return (
    <View flex={1}>
      <ScreenHeader
        title="RN Animated vs Moti"
        subtitle="Same CircleLayout driver — comparing the item interaction layer"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selectedLabel && (
          <AnimView entering={FadeIn.duration(200)} style={styles.toast}>
            <Text style={styles.toastText}>{selectedLabel} tapped</Text>
          </AnimView>
        )}

        <View alignItems="center">
          <Text style={styles.label}>RN Animated</Text>
          <CircleLayout
            components={ICONS.map((icon) => (
              <RnAnimatedItem
                key={icon.name}
                icon={icon}
                onPress={handleItemPress}
              />
            ))}
            centerComponent={
              <Animated.View style={rnFabStyle}>
                <Pressable onPress={toggleMenu}>
                  <CircleBadge size={52} color="#334155" shadow="fab">
                    <AntDesign
                      name={visible ? 'close' : 'plus'}
                      size={28}
                      color="#fff"
                    />
                  </CircleBadge>
                </Pressable>
              </Animated.View>
            }
            radius={RADIUS}
            ref={rnCircleRef}
            animationProps={{
              animationCombinationType: AnimationCombinationType.SEQUENCE,
              animationGap: 80,
              animationConfigs: {
                [AnimationType.LINEAR]: { duration: 300 },
                [AnimationType.OPACITY]: { duration: 200 },
              },
            }}
          />
        </View>

        <View alignItems="center">
          <Text style={styles.label}>Moti + Reanimated</Text>
          <CircleLayout
            components={ICONS.map((icon) => (
              <MotiItem key={icon.name} icon={icon} onPress={handleItemPress} />
            ))}
            centerComponent={
              <AnimView style={motiFabStyle}>
                <Pressable onPress={toggleMenu}>
                  <CircleBadge size={52} color="#6366f1" shadow="fab">
                    <AntDesign
                      name={visible ? 'close' : 'plus'}
                      size={28}
                      color="#fff"
                    />
                  </CircleBadge>
                </Pressable>
              </AnimView>
            }
            radius={RADIUS}
            ref={motiCircleRef}
            animationProps={{
              animationCombinationType: AnimationCombinationType.SEQUENCE,
              animationGap: 80,
              animationConfigs: {
                [AnimationType.LINEAR]: { duration: 300 },
                [AnimationType.OPACITY]: { duration: 200 },
              },
            }}
          />
        </View>
      </ScrollView>

      <DriverMetricsFooter
        items={METRICS_ITEMS}
        trackStressDrop
        columns={[
          {
            label: 'RN Animated',
            lines: [
              `FAB settle: ${rnFabSettleMs === null ? '—' : `${rnFabSettleMs}ms`}`,
            ],
          },
          {
            label: 'Moti',
            lines: [
              `FAB settle: ${motiFabSettleMs === null ? '—' : `${motiFabSettleMs}ms`}`,
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 32,
  },
  label: {
    color: '#0B0B0B',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    backgroundColor: '#1e1e2e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  toastText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MotiIntegration;
