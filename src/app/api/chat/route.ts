// Next.js proxy route for the assistant chat endpoint.

import { proxyApiRequest } from "@/lib/api";
import type { ChatResponse } from "@/lib/types";

export async function POST(request: Request) {
  // Preserve the original JSON body and forward it to the Python API.
  const body = await request.text();

  return proxyApiRequest<ChatResponse>("/api/v1/chat", {
    method: "POST",
    body,
  });
}
