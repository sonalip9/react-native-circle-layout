import React from 'react';

import type { CircleLayoutContextType } from './types';

export const CircleLayoutContext = React.createContext<CircleLayoutContextType>(
  {
    totalPoints: 0,
    radius: 0,
    startAngle: 0,
  }
);
