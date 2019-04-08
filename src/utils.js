/**
 * Convert a Date to a timestamp.
 */
export function toMilliseconds(options: Options, ...keys: Array<string>) {
  keys.forEach(function each(key) {
    const value = options[key];

    // Is it a Date object?
    if (typeof value === 'object' && typeof value.getMonth === 'function') {
      options[key] = value.getTime();
    }
  });
}
