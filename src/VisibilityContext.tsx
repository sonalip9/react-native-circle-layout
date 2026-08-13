import React from 'react';

/**
 * The single source of truth for "is this CircleLayout's components visible"
 * consumed directly by Bg and CircleLayoutComponent. Provided by
 * CircleLayoutContent, which resolves the `visible` prop / imperative ref
 * intent into one boolean.
 */
export const VisibilityContext = React.createContext(true);
