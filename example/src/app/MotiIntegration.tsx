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
import { DriverMetricsFooter } from '../DriverMetrics';
import { View } from '../design_system/atoms';
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
      style={[
        styles.item,
        { backgroundColor: icon.color, transform: [{ scale }] },
      ]}
    >
      <AntDesign name={icon.name} size={22} color="#fff" />
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
      style={[styles.item, { backgroundColor: icon.color }]}
    >
      <AntDesign name={icon.name} size={22} color="#fff" />
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
  const isMountedRef = React.useRef(true);
  React.useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    []
  );

  const toggleMenu = () => {
    const next = !visible;
    setVisible(next);

    const rnStartedAt = Date.now();
    Animated.spring(rnFabRotation, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      ...FAB_SPRING,
    }).start(() => {
      if (isMountedRef.current) setRnFabSettleMs(Date.now() - rnStartedAt);
    });

    const motiStartedAt = Date.now();
    motiFabRotation.value = withSpring(next ? 1 : 0, FAB_SPRING, (finished) => {
      // `isMountedRef` is a plain JS ref: only safe to read once back on the
      // JS thread (inside the `runOnJS`-scheduled callback), not here in the
      // worklet — reading it directly on the UI thread isn't supported.
      if (finished) {
        runOnJS(() => {
          if (isMountedRef.current) {
            setMotiFabSettleMs(Date.now() - motiStartedAt);
          }
        })();
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
                <Pressable
                  style={[styles.fab, styles.fabRn]}
                  onPress={toggleMenu}
                >
                  <AntDesign
                    name={visible ? 'close' : 'plus'}
                    size={28}
                    color="#fff"
                  />
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
                <Pressable
                  style={[styles.fab, styles.fabMoti]}
                  onPress={toggleMenu}
                >
                  <AntDesign
                    name={visible ? 'close' : 'plus'}
                    size={28}
                    color="#fff"
                  />
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
  item: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabRn: {
    backgroundColor: '#334155',
    shadowColor: '#334155',
  },
  fabMoti: {
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
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
