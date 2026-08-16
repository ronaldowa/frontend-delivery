// Shared TypeScript contracts mirroring the API responses consumed by the UI.

export type ChatSource = {
  source: string;
  category: string;
  score: number;
  page_start?: number | null;
  page_end?: number | null;
  chunk_index?: number | null;
};

export type ChatResponse = {
  answer: string;
  sources: ChatSource[];
};

export type RAGPDFTestMatch = ChatSource & {
  content_preview: string;
};

export type RAGPDFTestResponse = {
  pdf_path: string;
  question: string;
  category: string;
  chunks_created: number;
  matches: RAGPDFTestMatch[];
};

export type HealthResponse = {
  status: string;
  service: string;
  environment: string;
};
