/**
 * Resolves an array of style objects into a single style object by merging them together.
 * If the input is undefined, an empty object is returned.
 * @param styles The styles to be resolved. This can be an array of style objects or undefined.
 * @returns A single style object that is the result of merging all the styles in the input
 * array. If the input is undefined, an empty object is returned.
 */
export function resolveStyles<T extends object>(styles?: (T | undefined)[]): T {
  return (
    styles?.reduce(
      (acc, style) => (!style ? acc : { ...acc, ...style }),
      {} as T
    ) ?? ({} as T)
  );
}
