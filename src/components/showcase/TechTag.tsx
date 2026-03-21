// ---------------------------------------------------------------------------
// TechTag — a compact pill displaying a single technology name.
// Used on the card (truncated list) and the detail page (full list).
// ---------------------------------------------------------------------------

interface TechTagProps {
  name: string;
}

export function TechTag({ name }: TechTagProps) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
      {name}
    </span>
  );
}
