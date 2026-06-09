import React from 'react';

import type { AnimationDriver } from './animation/types';
import { rnAnimatedDriver } from './animation/rnAnimatedDriver';
import type { CircleLayoutContextType } from './types';

/**
 * A context for the circle layout component.
 */
export const CircleLayoutContext = React.createContext<
  CircleLayoutContextType<AnimationDriver>
>({
  totalParts: 0,
  radius: 0,
  startAngle: 0,
  sectorAngle: 0,
  animationDriver: rnAnimatedDriver,
});
