export const isChanged = <T extends Record<string, unknown>>(
  original: T,
  current: T
): boolean => {
  return Object.keys(original).some((key) => original[key] !== current[key]);
};
