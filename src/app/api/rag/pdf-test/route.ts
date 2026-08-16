// Next.js proxy route for the isolated RAG PDF test endpoint.

import { proxyApiRequest } from "@/lib/api";
import type { RAGPDFTestResponse } from "@/lib/types";

export async function POST(request: Request) {
  // Forward the test payload without changing its schema.
  const body = await request.text();

  return proxyApiRequest<RAGPDFTestResponse>("/api/v1/rag/pdf/test", {
    method: "POST",
    body,
  });
}
