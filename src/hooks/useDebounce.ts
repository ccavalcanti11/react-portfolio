import { useState, useEffect } from "react";

/**
 * Returns a debounced copy of `value` that only updates after
 * `delay` milliseconds have passed since the last change.
 *
 * Typical use: prevent firing an API call (or navigation) on every
 * keystroke while the user is still typing.
 *
 * @example
 * const debouncedSearch = useDebounce(inputValue, 500);
 * // debouncedSearch trails inputValue by 500 ms
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Cancel the timer if value changes before the delay elapses
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
