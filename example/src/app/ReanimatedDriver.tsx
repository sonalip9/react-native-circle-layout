import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View as RNView,
} from 'react-native';
import ReanimatedAnimated from 'react-native-reanimated';

import {
  AnimationCombinationType,
  AnimationType,
  CircleLayout,
  type AnimationDriver,
  type CircleLayoutRef,
} from 'react-native-circle-layout';

import { View } from '../design_system/atoms';

const ICONS: AntDesignIconName[] = [
  'heart',
  'star',
  'setting',
  'camera',
  'edit',
  'home',
  'search',
  'user',
  'phone',
  'mail',
  'lock',
  'cloud',
];

const RADIUS = 120;

type SpringPreset = {
  label: string;
  damping: number;
  stiffness: number;
  mass: number;
};

const PRESETS: SpringPreset[] = [
  { label: 'GENTLE', damping: 20, stiffness: 80, mass: 1 },
  { label: 'BOUNCY', damping: 6, stiffness: 180, mass: 0.5 },
  { label: 'STIFF', damping: 30, stiffness: 300, mass: 0.8 },
];

type SpringConfig = {
  damping: number;
  stiffness: number;
  mass: number;
};

/**
 * Samples a callback over a numeric range to produce input/output arrays
 * suitable for Animated.Value.interpolate(). Equivalent to the library's
 * internal withFunction utility (not part of the public API).
 * @param callback - maps input sample to output
 * @param config - range and resolution
 * @returns inputRange and outputRange arrays
 */
function withFunction<T extends number | string>(
  callback: (value: number) => T,
  config?: { startValue?: number; endValue?: number; totalIterations?: number }
) {
  const { startValue = 0, endValue = 1, totalIterations = 50 } = config ?? {};
  const inputRange: number[] = [];
  const outputRange: T[] = [];
  if (totalIterations === 0) return { inputRange, outputRange };
  for (let i = 0; i <= totalIterations; i++) {
    const key = startValue + ((endValue - startValue) * i) / totalIterations;
    inputRange.push(key);
    outputRange.push(callback(key));
  }
  return { inputRange, outputRange };
}

/**
 * Builds a spring-based AnimationDriver. Uses RN Animated nodes for
 * reactive graph operations (multiply/subtract/interpolate) and
 * Animated.spring for physics-based entry/exit animations instead
 * of the default Animated.timing.
 *
 * createAnimatedComponent comes from react-native-reanimated, giving
 * Reanimated's optimized rendering path for the animated views.
 * @param preset - spring physics preset
 * @returns an AnimationDriver backed by spring physics
 */
function createSpringDriver(
  preset: SpringPreset
): AnimationDriver<
  Animated.Value,
  Animated.AnimatedInterpolation<number | string>,
  Animated.CompositeAnimation,
  SpringConfig
> {
  return {
    createValue: (n) => new Animated.Value(n),

    setValue: (v, n) => v.setValue(n),

    addValueListener: (v, cb) => {
      const id = v.addListener(({ value }) => cb(value));
      return () => v.removeListener(id);
    },

    timing: (value, toValue, _config, useNativeDriver = true) =>
      Animated.spring(value, {
        useNativeDriver,
        toValue,
        damping: preset.damping,
        stiffness: preset.stiffness,
        mass: preset.mass,
      }),

    sequence: (anims) => Animated.sequence(anims),
    parallel: (anims) => Animated.parallel(anims),
    delay: (ms) => Animated.delay(ms),
    start: (anim, cb) => anim.start(cb),

    multiply: (a, b) =>
      Animated.multiply(
        a as Animated.Value | Animated.AnimatedInterpolation<number> | number,
        b as Animated.Value | Animated.AnimatedInterpolation<number> | number
      ),

    subtract: (a, b) =>
      Animated.subtract(
        a as Animated.Value | Animated.AnimatedInterpolation<number> | number,
        b as Animated.Value | Animated.AnimatedInterpolation<number> | number
      ),

    interpolate: (value, callback, config) =>
      (value as Animated.Value).interpolate(withFunction(callback, config)),

    isAnimatedValue: (v): v is Animated.Value => v instanceof Animated.Value,

    createAnimatedComponent: (C) =>
      ReanimatedAnimated.createAnimatedComponent(
        C as React.ComponentType<object>
      ) as typeof C,
  };
}

const ReanimatedDriver = () => {
  const [presetIdx, setPresetIdx] = React.useState(0);
  const [showTiming, setShowTiming] = React.useState(false);
  const [showSpring, setShowSpring] = React.useState(false);

  const timingRef = React.useRef<CircleLayoutRef>(null);
  const springRef = React.useRef<CircleLayoutRef>(null);

  const preset = PRESETS[presetIdx]!;
  const springDriver = React.useMemo(
    () => createSpringDriver(preset),
    [preset]
  );

  React.useEffect(() => {
    if (showTiming) {
      timingRef.current?.showComponents();
    } else {
      timingRef.current?.hideComponents();
    }
  }, [showTiming]);

  React.useEffect(() => {
    if (showSpring) {
      springRef.current?.showComponents();
    } else {
      springRef.current?.hideComponents();
    }
  }, [showSpring]);

  const iconComponents = ICONS.map((icon) => (
    <RNView key={icon} style={styles.iconItem}>
      <AntDesign name={icon} size={18} color="#fff" />
    </RNView>
  ));

  const springIconComponents = ICONS.map((icon) => (
    <RNView key={icon} style={styles.springIconItem}>
      <AntDesign name={icon} size={18} color="#fff" />
    </RNView>
  ));

  return (
    <View flex={1}>
      <RNView style={styles.presetRow}>
        {PRESETS.map((p, i) => (
          <TouchableOpacity
            key={p.label}
            style={[
              styles.presetBtn,
              presetIdx === i && styles.presetBtnActive,
            ]}
            onPress={() => setPresetIdx(i)}
          >
            <Text
              style={[
                styles.presetText,
                presetIdx === i && styles.presetTextActive,
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </RNView>

      <View flex={1} flexDirection="row">
        <View flex={1} alignItems="center" justifyContent="center">
          <Text style={styles.label}>Default (Timing)</Text>
          <CircleLayout
            components={iconComponents}
            centerComponent={
              <TouchableOpacity
                style={styles.centerBtn}
                onPress={() => setShowTiming((v) => !v)}
              >
                <AntDesign
                  name={showTiming ? 'close' : 'appstore'}
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            }
            radius={RADIUS}
            ref={timingRef}
            animationProps={{
              animationCombinationType: AnimationCombinationType.SEQUENCE,
              animationGap: 40,
              animationConfigs: {
                [AnimationType.LINEAR]: { duration: 400 },
                [AnimationType.OPACITY]: { duration: 300 },
              },
            }}
          />
        </View>

        <View flex={1} alignItems="center" justifyContent="center">
          <Text style={styles.label}>Spring Driver ({preset.label})</Text>
          <CircleLayout
            components={springIconComponents}
            centerComponent={
              <TouchableOpacity
                style={[styles.centerBtn, styles.springCenterBtn]}
                onPress={() => setShowSpring((v) => !v)}
              >
                <AntDesign
                  name={showSpring ? 'close' : 'appstore'}
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            }
            radius={RADIUS}
            ref={springRef}
            animationDriver={springDriver}
            animationProps={{
              animationCombinationType: AnimationCombinationType.SEQUENCE,
              animationGap: 40,
              animationConfigs: {
                [AnimationType.LINEAR]: {
                  damping: preset.damping,
                  stiffness: preset.stiffness,
                  mass: preset.mass,
                },
                [AnimationType.OPACITY]: {
                  damping: preset.damping,
                  stiffness: preset.stiffness,
                  mass: preset.mass,
                },
              },
            }}
          />
        </View>
      </View>

      <RNView style={styles.footer}>
        <Text style={styles.footerText}>
          damping: {preset.damping} · stiffness: {preset.stiffness} · mass:{' '}
          {preset.mass}
        </Text>
      </RNView>
    </View>
  );
};

const styles = StyleSheet.create({
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  presetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  presetBtnActive: {
    backgroundColor: '#6366f1',
  },
  presetText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 13,
  },
  presetTextActive: {
    color: '#fff',
  },
  label: {
    color: '#0B0B0B',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  iconItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5A31F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  springIconItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e1e2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  springCenterBtn: {
    backgroundColor: '#4f46e5',
  },
  footer: {
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
    fontFamily: 'monospace',
  },
});

export default ReanimatedDriver;
