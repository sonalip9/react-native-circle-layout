import * as React from 'react';
import { Pressable, StyleSheet, Text, View as RNView } from 'react-native';

const STRESS_MS = 300;

/**
 * Blocks the JS thread synchronously for `ms` milliseconds. Used to prove
 * an animation doesn't depend on JS thread throughput: RN Animated's spring
 * runs with `useNativeDriver: true`, and Reanimated/Moti run inside UI
 * thread worklets — both execute off the JS thread, so this block should
 * not visibly stutter either one.
 * @param ms - how long to block, in milliseconds
 */
export function blockJsThread(ms: number = STRESS_MS): void {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // busy-wait
  }
}

/**
 * Guards callbacks against firing after unmount — for async completion
 * callbacks (animation `onDone`, driver listeners) that can resolve once a
 * driver-comparison screen has been navigated away from.
 * @returns `guard(fn)`, wrapping `fn` so it's a no-op once unmounted
 */
export function useMountedGuard(): <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic callback wrapper, any callback signature
  T extends (...args: any[]) => void,
>(
  fn: T
) => T {
  const mountedRef = React.useRef(true);
  React.useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  return React.useCallback(
    <
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic callback wrapper, any callback signature
      T extends (...args: any[]) => void,
    >(
      fn: T
    ) =>
      ((...args: Parameters<T>) => {
        if (mountedRef.current) fn(...args);
      }) as T,
    []
  );
}

/**
 * JS thread FPS, sampled on a `setInterval` heartbeat rather than a
 * self-rescheduling `requestAnimationFrame` chain. A chained rAF loop dies
 * permanently the moment one call doesn't fire (e.g. a backgrounded /
 * hidden webview, which fully suspends rAF) — there is nothing left to
 * reschedule the next call, so the display freezes forever at its last
 * value. Counting frames via rAF (best-effort, stops the same way) but
 * reading + resetting that count on an independent interval means the
 * displayed number keeps updating regardless — correctly dropping to 0 if
 * rAF really did stop, instead of silently going stale.
 */
export function useJsThreadFps(): number {
  const [fps, setFps] = React.useState(0);
  const frameCountRef = React.useRef(0);

  React.useEffect(() => {
    let rafId = 0;
    const countFrame = () => {
      frameCountRef.current += 1;
      rafId = requestAnimationFrame(countFrame);
    };
    rafId = requestAnimationFrame(countFrame);

    const intervalId = setInterval(() => {
      setFps(frameCountRef.current * 2);
      frameCountRef.current = 0;
    }, 500);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(intervalId);
    };
  }, []);

  return fps;
}

export type DriverCost = { label: string; detail: string };

export type DriverColumnMetrics = { label: string; lines: string[] };

/**
 * Tracks JS-thread FPS immediately before and shortly after a `blockJsThread`
 * stress run, so a real dip (or its absence) is visible on screen instead of
 * asserted in a comment. Reads `fps` on its own polling cadence rather than
 * timing a fixed delay, so the "after" sample always lands on a fresh
 * `useJsThreadFps` tick — at least one full interval past the stress call.
 * @param fps - the current JS-thread FPS reading from {@link useJsThreadFps}
 * @returns the last measured dip (if any) and a function to trigger a new stress run
 */
function useStressDropMetric(fps: number) {
  const [drop, setDrop] = React.useState<{
    before: number;
    after: number;
  } | null>(null);
  const measuringSinceRef = React.useRef<number | null>(null);
  const beforeRef = React.useRef(0);

  React.useEffect(() => {
    if (measuringSinceRef.current === null) return;
    if (Date.now() - measuringSinceRef.current < 600) return;
    measuringSinceRef.current = null;
    setDrop({ before: beforeRef.current, after: fps });
  }, [fps]);

  const runStress = React.useCallback(() => {
    beforeRef.current = fps;
    measuringSinceRef.current = Date.now();
    blockJsThread();
  }, [fps]);

  return { drop, runStress };
}

/**
 * Shared driver-comparison footer: JS-thread FPS, a stress-JS button, and
 * an integration-cost summary. Screens comparing more than one driver can
 * also pass `columns` for per-driver live metrics and `trackStressDrop` to
 * report the FPS dip the stress button causes.
 * @param root0 - the footer's props
 * @param root0.items - static integration-cost summary, one line per driver
 * @param root0.columns - optional per-driver live metrics, one panel per driver
 * @param root0.trackStressDrop - when true, the stress button reports the FPS dip it causes
 * @returns the footer element
 */
export function DriverMetricsFooter({
  items,
  columns,
  trackStressDrop = false,
}: {
  items: DriverCost[];
  /** Optional per-driver live metrics (e.g. listener count, settle time), rendered as one panel per column. */
  columns?: DriverColumnMetrics[];
  /** When true, the stress button also reports the JS-thread FPS dip it causes. */
  trackStressDrop?: boolean;
}) {
  const fps = useJsThreadFps();
  const { drop, runStress } = useStressDropMetric(fps);

  return (
    <RNView style={styles.footer}>
      {columns && (
        <RNView style={styles.columnsRow}>
          {columns.map((column) => (
            <RNView key={column.label} style={styles.columnPanel}>
              <Text style={styles.columnLabel}>{column.label}</Text>
              {column.lines.map((line) => (
                <Text key={line} style={styles.metricsLine}>
                  {line}
                </Text>
              ))}
            </RNView>
          ))}
        </RNView>
      )}
      <Text style={styles.footerText}>JS thread FPS: {fps}</Text>
      <Pressable
        style={styles.stressBtn}
        onPress={trackStressDrop ? runStress : () => blockJsThread()}
      >
        <Text style={styles.stressBtnText}>Stress JS (~{STRESS_MS}ms)</Text>
      </Pressable>
      {trackStressDrop && drop && (
        <Text style={styles.metricsLine}>
          Stress dip: {drop.before} → {drop.after} FPS
        </Text>
      )}
      <RNView style={styles.metricsPanel}>
        {items.map((item) => (
          <Text key={item.label} style={styles.metricsLine}>
            {item.label}: {item.detail}
          </Text>
        ))}
      </RNView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 4,
  },
  columnPanel: {
    alignItems: 'center',
    gap: 2,
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B0B0B',
  },
  footerText: {
    fontSize: 13,
    color: '#0B0B0B',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  stressBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  stressBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  metricsPanel: {
    marginTop: 4,
    alignItems: 'center',
    gap: 2,
  },
  metricsLine: {
    fontSize: 11,
    color: '#9E9E9E',
  },
});
