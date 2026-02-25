import "@testing-library/jest-dom";

// ---------------------------------------------------------------------------
// window.matchMedia mock
// jsdom does not implement matchMedia. Any component that reads
// `prefers-color-scheme` (e.g. ThemeToggle) will throw without this stub.
// ---------------------------------------------------------------------------
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
