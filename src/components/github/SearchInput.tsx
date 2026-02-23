"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchInputProps {
  /** Pre-fill the input (e.g., current profile's username) */
  defaultValue?: string;
  /** Visual size variant */
  size?: "default" | "large";
}

/**
 * Controlled search input with debounce-driven navigation.
 *
 * The `useDebounce` hook delays the side-effect (router.push) by 500 ms,
 * so we only navigate once the user pauses typing — not on every keystroke.
 * Users can also navigate immediately by pressing Enter or clicking "Explore".
 */
export function SearchInput({
  defaultValue = "",
  size = "default",
}: SearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [isDirty, setIsDirty] = useState(false);

  // The debounced value settles 500 ms after the user stops typing
  const debouncedValue = useDebounce(value, 500);

  // Keep the input in sync when the parent supplies a new defaultValue
  // (e.g., the profile page loaded a different user), but only when the
  // user has not started typing a new search themselves.
  useEffect(() => {
    if (!isDirty) setValue(defaultValue);
  }, [defaultValue, isDirty]);

  // Auto-navigate once the debounced value stabilises and differs from the
  // currently displayed profile — this is the debounce pattern in action.
  useEffect(() => {
    const trimmed = debouncedValue.trim();
    if (isDirty && trimmed && trimmed !== defaultValue) {
      router.push(`/github/${encodeURIComponent(trimmed)}`);
      setIsDirty(false);
    }
  }, [debouncedValue, defaultValue, isDirty, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setIsDirty(false);
    router.push(`/github/${encodeURIComponent(trimmed)}`);
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div
        className={`flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 shadow-sm transition-shadow focus-within:shadow-md dark:border-zinc-700 dark:bg-zinc-900 ${
          isLarge ? "py-3" : "py-2"
        }`}
      >
        {/* Search icon */}
        <svg
          className="h-4 w-4 shrink-0 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsDirty(true);
          }}
          placeholder="Search GitHub username…"
          aria-label="GitHub username"
          autoComplete="off"
          spellCheck={false}
          className={`flex-1 bg-transparent outline-none placeholder:text-zinc-400 dark:text-white ${
            isLarge ? "text-lg" : "text-sm"
          }`}
        />

        <button
          type="submit"
          disabled={!value.trim()}
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Explore
        </button>
      </div>
    </form>
  );
}
