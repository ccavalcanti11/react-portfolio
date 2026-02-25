"use client";

// ---------------------------------------------------------------------------
// LiveIndicator — shows subscription connection status.
//
// In demo mode the dot is amber and labelled "Demo · simulated events".
// When a real graphql-ws backend is connected it would turn green and show
// "Live". The `lastEventAt` timestamp drives a short CSS pulse animation
// every time a new subscription event arrives.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";

interface LiveIndicatorProps {
  lastEventAt: number | null;
}

export function LiveIndicator({ lastEventAt }: LiveIndicatorProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (lastEventAt === null) return;
    setIsFlashing(true);
    const timer = setTimeout(() => setIsFlashing(false), 1_500);
    return () => clearTimeout(timer);
  }, [lastEventAt]);

  return (
    <div
      className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500"
      title="GraphQL subscription simulation — events emitted every ~9 s to mimic a real backend"
    >
      <span
        aria-hidden="true"
        className={[
          "inline-block h-2 w-2 rounded-full transition-colors duration-300",
          isFlashing
            ? "animate-ping bg-emerald-500"
            : "bg-amber-400 dark:bg-amber-500",
        ].join(" ")}
      />
      <span>
        {isFlashing ? (
          <span className="text-emerald-600 dark:text-emerald-400">
            Event received
          </span>
        ) : (
          "Demo · simulated events"
        )}
      </span>
    </div>
  );
}
