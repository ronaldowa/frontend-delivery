"use client";

import { FormEvent, useState } from "react";
import { FileSearch, Loader2 } from "lucide-react";
import type { RAGPDFTestResponse } from "@/lib/types";
import { formatHumanText, formatLabel, normalizeMessageForApi } from "@/lib/text";

const PDF_OPTIONS = [
  {
    label: "Atendimento, trocas, devolucoes e privacidade",
    value: "atendimento/politica_atendimento_trocas_devolucoes_privacidade.pdf",
  },
  {
    label: "FAQ Mercado Central 24h",
    value: "faq/faq_mercado_central_24h.pdf",
  },
  {
    label: "Fornecedores e politica de compras",
    value: "fornecedores/manual_fornecedores_politica_compras.pdf",
  },
  {
    label: "Operacoes e procedimentos operacionais",
    value: "operacoes/regulamento_manual_procedimentos_operacionais.pdf",
  },
];

export function RagTestPanel() {
  // Estados da consulta direta aos PDFs usados para validar a recuperacao RAG.
  const [pdfPath, setPdfPath] = useState("faq/faq_mercado_central_24h.pdf");
  const [question, setQuestion] = useState("Quais canais de atendimento estao disponiveis?");
  const [result, setResult] = useState<RAGPDFTestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    const cleanQuestion = normalizeMessageForApi(question);

    try {
      // Consulta um PDF especifico mantendo os parametros tecnicos padronizados.
      const response = await fetch("/api/rag/pdf-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdf_path: pdfPath,
          question: cleanQuestion,
          limit: 4,
          min_score: 0,
          chunk_size: 1000,
          chunk_overlap: 200,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.detail?.detail ?? payload?.message ?? "Nao foi possivel consultar o documento.");
      }

      setResult(payload as RAGPDFTestResponse);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-white/75 bg-white/92 p-4 shadow-soft backdrop-blur sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink sm:text-xl">Consultar documentos</h2>
          <p className="text-sm text-ink/65">Escolha uma area e encontre informacoes na base de conhecimento.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Documento
          <select
            value={pdfPath}
            onChange={(event) => setPdfPath(event.target.value)}
            className="min-h-12 rounded-lg border border-ink/12 bg-white px-3 text-sm font-normal outline-none shadow-sm focus:border-ocean focus:ring-4 focus:ring-ocean/10"
          >
            {PDF_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Pergunta
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            disabled={isLoading}
            rows={4}
            maxLength={4000}
            className="min-h-32 resize-y rounded-lg border border-ink/12 bg-white px-3 py-3 text-sm font-normal outline-none shadow-sm focus:border-ocean focus:ring-4 focus:ring-ocean/10 disabled:text-ink/45"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading || !pdfPath.trim() || !question.trim()}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ocean px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-ink disabled:bg-ocean/35 sm:w-fit"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <FileSearch className="h-4 w-4" aria-hidden />
          )}
          Testar PDF
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 grid gap-4">
          <div className="grid gap-3 rounded-lg border border-mint bg-mint/55 p-4 text-sm sm:grid-cols-2">
            <Info label="Categoria" value={formatLabel(result.category)} />
            <Info label="Trechos encontrados" value={String(result.matches.length)} />
          </div>
          <div className="grid gap-3">
            {result.matches.map((match, index) => (
              <article key={`${match.source}-${index}`} className="rounded-lg border border-ink/8 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-ink">{formatLabel(match.category)}</p>
                    <p className="mt-1 text-xs text-ink/60">
                      {match.page_start ? `Pagina ${match.page_start}` : "Documento selecionado"}
                    </p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink/75">
                  {formatHumanText(match.content_preview)}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  // Bloco compacto para destacar metadados do resultado da consulta.
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-ink/55">{label}</p>
      <p className="mt-1 break-words font-bold text-ink">{value}</p>
    </div>
  );
}
