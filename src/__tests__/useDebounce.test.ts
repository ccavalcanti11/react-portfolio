import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("does not update before the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } }
    );

    rerender({ value: "world", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // 300 ms < 500 ms — value should still be the original
    expect(result.current).toBe("hello");
  });

  it("updates after the full delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } }
    );

    rerender({ value: "world", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("world");
  });

  it("resets the timer on rapid consecutive updates", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );

    // First update at t=0, timer reset
    rerender({ value: "b", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300); // t=300, timer not yet fired
    });

    // Second update at t=300, timer reset again
    rerender({ value: "c", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300); // t=600, but new timer started at t=300 — not yet at 500ms
    });

    // Value should still be "a" — neither "b" nor "c" won
    expect(result.current).toBe("a");

    // Advance past the second timer's full delay
    act(() => {
      jest.advanceTimersByTime(200); // t=800 → 500ms since last rerender at t=300
    });

    expect(result.current).toBe("c");
  });
});
