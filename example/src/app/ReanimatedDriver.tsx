import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View as RNView,
} from 'react-native';
import {
  createAnimatedComponent,
  isSharedValue,
  makeMutable,
  runOnJS,
  runOnUI,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';

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

let nextListenerId = 0;

type DriverNode = SharedValue<number> | SharedValue<number | string> | number;

/**
 * Reads the current number of a driver value that may be a plain number or
 * a Reanimated shared value. Driver values only ever hold numbers in this
 * example (icon positions), even though `SharedValue<number | string>` is
 * typed to also allow strings for other consumers of `AnimationDriver`
 * (e.g. interpolated SVG path strings).
 * @param value - a driver value, or a plain number
 * @returns the current number
 */
function readNumber(value: DriverNode): number {
  return isSharedValue(value) ? (value.value as number) : (value as number);
}

/**
 * Builds a shared value derived from one or more driver values, kept in
 * sync via Reanimated's imperative `addListener` API. This is the
 * Reanimated analogue of RN Animated's node graph (`Animated.multiply`,
 * `Animated.subtract`, `.interpolate()`), which has no direct equivalent
 * since Reanimated favours reactive worklets over composable nodes.
 *
 * `SharedValue.addListener` may only be called from the UI runtime, and
 * its listener fires there too — so registration is dispatched via
 * `runOnUI`, and the listener hops back to the JS thread via `runOnJS`
 * before calling `compute` (which may call arbitrary, non-worklet JS
 * passed in by the caller, e.g. `AnimationDriver.interpolate`'s callback).
 * @param inputs - driver values the result depends on
 * @param compute - recomputes the derived value from the current inputs
 * @returns a shared value that updates whenever a dependent input changes
 */
function deriveSharedValue<T extends number | string>(
  inputs: DriverNode[],
  compute: () => T
): SharedValue<T> {
  const derived = makeMutable(compute());
  const recompute = () => {
    derived.value = compute();
  };
  for (const input of inputs) {
    if (isSharedValue(input)) {
      const id = nextListenerId++;
      runOnUI(() => {
        'worklet';
        input.addListener(id, () => {
          runOnJS(recompute)();
        });
      })();
    }
  }
  return derived;
}

/**
 * Builds a spring-based AnimationDriver backed entirely by
 * react-native-reanimated: shared values (`makeMutable`) instead of RN
 * Animated nodes, `withSpring` instead of `Animated.timing`, and
 * Reanimated's `createAnimatedComponent`. Every method must come from the
 * same animation library — mixing RN Animated nodes into a
 * Reanimated-wrapped component (or vice versa) breaks transform
 * resolution, since neither library can unwrap the other's node objects.
 * @param preset - spring physics preset
 * @returns an AnimationDriver backed by spring physics
 */
function createSpringDriver(
  preset: SpringPreset
): AnimationDriver<
  SharedValue<number>,
  SharedValue<number | string>,
  (onDone: () => void) => void,
  SpringConfig
> {
  return {
    createValue: (n) => makeMutable(n),

    setValue: (v, n) => {
      v.value = n;
    },

    addValueListener: (v, cb) => {
      const id = nextListenerId++;
      runOnUI(() => {
        'worklet';
        v.addListener(id, (current) => {
          runOnJS(cb)(current);
        });
      })();
      return () => {
        runOnUI(() => {
          'worklet';
          v.removeListener(id);
        })();
      };
    },

    timing: (value, toValue) => (onDone) => {
      value.value = withSpring(
        toValue,
        {
          damping: preset.damping,
          stiffness: preset.stiffness,
          mass: preset.mass,
        },
        () => {
          runOnJS(onDone)();
        }
      );
    },

    sequence: (anims) => (onDone) => {
      const runFrom = (i: number): void => {
        if (i >= anims.length) return onDone();
        anims[i]!(() => runFrom(i + 1));
      };
      runFrom(0);
    },

    parallel: (anims) => (onDone) => {
      if (anims.length === 0) return onDone();
      let remaining = anims.length;
      for (const anim of anims) {
        anim(() => {
          remaining -= 1;
          if (remaining === 0) onDone();
        });
      }
    },

    delay: (ms) => (onDone) => {
      setTimeout(onDone, ms);
    },

    start: (anim, cb) => anim(() => cb?.()),

    multiply: (a, b) =>
      deriveSharedValue<number | string>(
        [a, b],
        () => readNumber(a) * readNumber(b)
      ),

    subtract: (a, b) =>
      deriveSharedValue<number | string>(
        [a, b],
        () => readNumber(a) - readNumber(b)
      ),

    interpolate: (value, callback) =>
      deriveSharedValue<number | string>([value], () =>
        callback(readNumber(value))
      ),

    isAnimatedValue: (v): v is SharedValue<number> => isSharedValue(v),

    createAnimatedComponent: (C) => createAnimatedComponent(C) as typeof C,
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
