import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import * as React from 'react';
import {
  ScrollView,
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
  rnAnimatedDriver,
  type AnimationDriver,
  type CircleLayoutRef,
} from 'react-native-circle-layout';

import { DriverMetricsFooter } from '../DriverMetrics';
import { CircleBadge, View } from '../design_system/atoms';

const METRICS_ITEMS = [
  {
    label: 'RN Animated',
    detail:
      '0 extra deps · built into react-native · driver: 74 lines (rnAnimatedDriver.ts), all built in — nothing to write',
  },
  {
    label: 'Reanimated',
    detail:
      'react-native-reanimated@4.3.1 (native module + Babel plugin) · custom AnimationDriver: 161 lines to write (readNumber + deriveSharedValue + createSpringDriver, this file)',
  },
];

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
 * @param onListenerRegistered - called (on the JS thread, via `runOnJS`)
 * once a listener actually attaches on the UI thread — a hook for counting
 * registrations, deliberately not read/written during render since the
 * registration itself is async.
 * @returns a shared value that updates whenever a dependent input changes
 */
function deriveSharedValue<T extends number | string>(
  inputs: DriverNode[],
  compute: () => T,
  onListenerRegistered?: () => void
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
        if (onListenerRegistered) runOnJS(onListenerRegistered)();
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
 * @param onListenerRegistered - called once per listener actually attached
 * by `multiply`/`subtract`/`interpolate`, for the on-screen listener-count
 * metric. See {@link deriveSharedValue} for why this is a callback, not a ref.
 * @returns an AnimationDriver backed by spring physics
 */
function createSpringDriver(
  preset: SpringPreset,
  onListenerRegistered: () => void
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
        () => readNumber(a) * readNumber(b),
        onListenerRegistered
      ),

    subtract: (a, b) =>
      deriveSharedValue<number | string>(
        [a, b],
        () => readNumber(a) - readNumber(b),
        onListenerRegistered
      ),

    interpolate: (value, callback) =>
      deriveSharedValue<number | string>(
        [value],
        () => callback(readNumber(value)),
        onListenerRegistered
      ),

    isAnimatedValue: (v): v is SharedValue<number> => isSharedValue(v),

    createAnimatedComponent: (C) => createAnimatedComponent(C) as typeof C,
  };
}

/**
 * Wraps any `AnimationDriver` to time entry/exit sequences: `start()` is the
 * one call both RN Animated's and the custom Reanimated driver's shapes
 * funnel through (their `timing`/composite types differ, `start` doesn't),
 * so this needs no per-driver special-casing to measure settle time.
 * @param driver - the driver to wrap
 * @param onSettle - called with the elapsed ms once `start`'s composite finishes
 * @returns a driver identical to `driver`, except `start` also times itself
 */
function withSettleTiming<TValue, TInterpolated, TComposite, TConfig>(
  driver: AnimationDriver<TValue, TInterpolated, TComposite, TConfig>,
  onSettle: (ms: number) => void
): AnimationDriver<TValue, TInterpolated, TComposite, TConfig> {
  return {
    ...driver,
    start: (animation, onComplete) => {
      const startedAt = Date.now();
      driver.start(animation, () => {
        onSettle(Date.now() - startedAt);
        onComplete?.();
      });
    },
  };
}

const ReanimatedDriver = () => {
  const [presetIdx, setPresetIdx] = React.useState(0);
  const [showTiming, setShowTiming] = React.useState(false);
  const [showSpring, setShowSpring] = React.useState(false);

  const timingRef = React.useRef<CircleLayoutRef>(null);
  const springRef = React.useRef<CircleLayoutRef>(null);

  const [rnSettleMs, setRnSettleMs] = React.useState<number | null>(null);
  const [springSettleMs, setSpringSettleMs] = React.useState<number | null>(
    null
  );
  const [springListenerCount, setSpringListenerCount] = React.useState(0);

  // Animations can outlive the screen (e.g. the long RN Animated SEQUENCE —
  // see below) — their onSettle callback must not set state after unmount.
  // A plain mutable box, not `useRef`: these callbacks are handed to
  // `useMemo` calls that run during render, and only ever read `.mounted`
  // later, asynchronously, once the animation actually settles — never
  // during render itself.
  const [mountedBox] = React.useState(() => ({ mounted: true }));
  React.useEffect(
    () => () => {
      mountedBox.mounted = false;
    },
    [mountedBox]
  );

  const bumpSpringListenerCount = React.useCallback(() => {
    if (mountedBox.mounted) setSpringListenerCount((c) => c + 1);
  }, [mountedBox]);

  const preset = PRESETS[presetIdx]!;
  const springDriver = React.useMemo(
    () => createSpringDriver(preset, bumpSpringListenerCount),
    [preset, bumpSpringListenerCount]
  );
  const timingDriver = React.useMemo(
    () =>
      withSettleTiming(rnAnimatedDriver, (ms) => {
        if (mountedBox.mounted) setRnSettleMs(ms);
      }),
    [mountedBox]
  );
  const measuredSpringDriver = React.useMemo(
    () =>
      withSettleTiming(springDriver, (ms) => {
        if (mountedBox.mounted) setSpringSettleMs(ms);
      }),
    [springDriver, mountedBox]
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
    <CircleBadge key={icon} size={36} color="#5A31F4">
      <AntDesign name={icon} size={18} color="#fff" />
    </CircleBadge>
  ));

  const springIconComponents = ICONS.map((icon) => (
    <CircleBadge key={icon} size={36} color="#6366f1">
      <AntDesign name={icon} size={18} color="#fff" />
    </CircleBadge>
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View alignItems="center">
          <Text style={styles.label}>Default (Timing)</Text>
          <CircleLayout
            components={iconComponents}
            centerComponent={
              <TouchableOpacity onPress={() => setShowTiming((v) => !v)}>
                <CircleBadge size={44} color="#1e1e2e">
                  <AntDesign
                    name={showTiming ? 'close' : 'appstore'}
                    size={22}
                    color="#fff"
                  />
                </CircleBadge>
              </TouchableOpacity>
            }
            radius={RADIUS}
            ref={timingRef}
            animationDriver={timingDriver}
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

        <View alignItems="center">
          <Text style={styles.label}>Spring Driver ({preset.label})</Text>
          <CircleLayout
            components={springIconComponents}
            centerComponent={
              <TouchableOpacity onPress={() => setShowSpring((v) => !v)}>
                <CircleBadge size={44} color="#4f46e5">
                  <AntDesign
                    name={showSpring ? 'close' : 'appstore'}
                    size={22}
                    color="#fff"
                  />
                </CircleBadge>
              </TouchableOpacity>
            }
            radius={RADIUS}
            ref={springRef}
            animationDriver={measuredSpringDriver}
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
      </ScrollView>

      <RNView style={styles.footer}>
        <Text style={styles.footerText}>
          damping: {preset.damping} · stiffness: {preset.stiffness} · mass:{' '}
          {preset.mass}
        </Text>
      </RNView>

      <DriverMetricsFooter
        items={METRICS_ITEMS}
        trackStressDrop
        columns={[
          {
            label: 'RN Animated',
            lines: [`Settle: ${rnSettleMs === null ? '—' : `${rnSettleMs}ms`}`],
          },
          {
            label: 'Reanimated',
            lines: [
              `Settle: ${springSettleMs === null ? '—' : `${springSettleMs}ms`}`,
              `Listeners: ${springListenerCount}`,
            ],
          },
        ]}
      />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 32,
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
