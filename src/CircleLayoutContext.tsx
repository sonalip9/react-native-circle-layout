import React from 'react';

import { rnAnimatedDriver } from './animation/rnAnimatedDriver';
import type { CircleLayoutContextType } from './types';

/**
 * A context for the circle layout component.
 */
export const CircleLayoutContext = React.createContext<CircleLayoutContextType>(
  {
    totalParts: 0,
    radius: 0,
    startAngle: 0,
    sectorAngle: 0,
    animationDriver: rnAnimatedDriver,
  }
);
