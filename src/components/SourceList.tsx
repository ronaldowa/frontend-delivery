// Displays source traceability when a screen needs to expose retrieved documents.

import type { ChatSource } from "@/lib/types";

type SourceListProps = {
  sources: ChatSource[];
  compact?: boolean;
};

export function SourceList({ sources, compact = false }: SourceListProps) {
  // Empty state keeps source sections from disappearing abruptly.
  if (sources.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-ink/20 px-4 py-3 text-sm text-ink/60">
        Nenhuma fonte retornada para esta resposta.
      </p>
    );
  }

  return (
    <div className={compact ? "grid gap-2" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
      {sources.map((source, index) => (
        <article
          key={`${source.source}-${source.chunk_index ?? index}`}
          className={`rounded-lg border border-ink/10 bg-white shadow-sm ${
            compact ? "p-3" : "p-4"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">{source.category}</p>
              <p className="mt-1 break-words text-xs text-ink/60">{source.source}</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-ocean">
            {formatPages(source.page_start, source.page_end)}
          </p>
        </article>
      ))}
    </div>
  );
}

function formatPages(pageStart?: number | null, pageEnd?: number | null) {
  // Converts nullable page metadata into a user-facing label.
  if (!pageStart) return "Fonte consultada";
  if (!pageEnd || pageEnd === pageStart) return `Pagina ${pageStart}`;
  return `Paginas ${pageStart} a ${pageEnd}`;
}
