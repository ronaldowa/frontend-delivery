const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

export function getApiBaseUrl() {
  // Permite trocar a API entre ambiente local, homologacao e producao por variavel de ambiente.
  return process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

export async function proxyApiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let response: globalThis.Response;

  try {
    // Todas as chamadas externas passam pelo servidor Next para evitar CORS no navegador.
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    return Response.json(
      {
        message: "Servico temporariamente indisponivel.",
        status: 503,
        detail: "Tente novamente em alguns instantes.",
      },
      { status: 503 },
    );
  }

  if (!response.ok) {
    const payload = await response.text();
    // Normaliza erros da API para o frontend tratar sempre o mesmo formato.
    return Response.json(
      {
        message: "Nao foi possivel concluir a solicitacao.",
        status: response.status,
        detail: safeParseJson<T>(payload) ?? payload,
      },
      { status: response.status },
    );
  }

  const data = (await response.json()) as T;
  return Response.json(data);
}

function safeParseJson<T>(value: string): T | null {
  // Alguns erros podem vir como texto puro; nesse caso retornamos null sem quebrar a tela.
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
