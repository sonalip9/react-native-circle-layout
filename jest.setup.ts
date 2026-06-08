import { Easing } from 'react-native';

// `Easing.ease`/`Easing.bezier` lazily `require('./bezier')` on first
// invocation and cache the curve in a module-level variable. Animated.timing
// schedules its update loop on real timers; if a stray callback fires after
// Jest tears the test environment down, that lazy `require` resolves against
// a registry that no longer exists and crashes the worker with
// `_bezier is not a function`. Invoking them once here, while the
// environment is intact, warms the cache so any later (even post-teardown)
// invocation reuses it instead of re-requiring.
Easing.ease(0);
Easing.bezier(0.42, 0, 1, 1)(0);
