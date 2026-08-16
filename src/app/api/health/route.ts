// Next.js proxy route for the API health check.

import { proxyApiRequest } from "@/lib/api";
import type { HealthResponse } from "@/lib/types";

export async function GET() {
  // Keeps browser clients using the same origin as the frontend.
  return proxyApiRequest<HealthResponse>("/health");
}
