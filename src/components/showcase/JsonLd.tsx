// ---------------------------------------------------------------------------
// JsonLd — injects a JSON-LD <script> block into the document head.
//
// JSON-LD (JSON for Linked Data) is Google's recommended format for
// structured data. It lets search engines understand page content beyond
// what they can infer from HTML alone — enabling rich results in SERPs.
//
// Usage:
//   <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", … }} />
//
// The component renders a <script type="application/ld+json"> with
// dangerouslySetInnerHTML. This is the standard, safe pattern for JSON-LD
// because the content is JSON (not executable JS) and is produced server-side
// from trusted data.
// ---------------------------------------------------------------------------

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
