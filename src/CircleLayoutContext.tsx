import React from 'react';

import type { CircleLayoutContextType } from './types';

/**
 * A context for the circle layout component.
 */
export const CircleLayoutContext = React.createContext<CircleLayoutContextType>(
  {
    totalParts: 0,
    radius: 0,
    startAngle: 0,
  }
);
