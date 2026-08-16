const MOJIBAKE_REPLACEMENTS: Record<string, string> = {
  "Ã¡": "a",
  "Ã ": "a",
  "Ã¢": "a",
  "Ã£": "a",
  "Ã©": "e",
  "Ãª": "e",
  "Ã­": "i",
  "Ã³": "o",
  "Ã´": "o",
  "Ãµ": "o",
  "Ãº": "u",
  "Ã§": "c",
  "Ã": "A",
  "Ã€": "A",
  "Ã‚": "A",
  "Ãƒ": "A",
  "Ã‰": "E",
  "ÃŠ": "E",
  "Ã": "I",
  "Ã“": "O",
  "Ã”": "O",
  "Ã•": "O",
  "Ãš": "U",
  "Ã‡": "C",
};

export function formatHumanText(value: string) {
  // Limpa texto vindo do usuario ou da API antes de exibir na interface.
  return removeSpecialCharacters(fixMojibake(value))
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

export function normalizeMessageForApi(value: string) {
  // Mantem simbolos importantes para protocolos, e-mails e codigos antes de enviar para a API.
  return fixMojibake(value)
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

export function formatLabel(value: string) {
  // Labels de categorias e arquivos ficam mais humanas sem underscores ou hifens.
  return formatHumanText(value.replace(/[_-]+/g, " "));
}

function fixMojibake(value: string) {
  // Corrige sequencias comuns de encoding quebrado encontradas nos textos extraidos.
  return Object.entries(MOJIBAKE_REPLACEMENTS).reduce(
    (current, [broken, fixed]) => current.replaceAll(broken, fixed),
    value,
  );
}

function removeSpecialCharacters(value: string) {
  // Remove acentos e simbolos fora do conjunto esperado para leitura em portugues simples.
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s.,;:!?%/()\-]/g, "")
    .replace(/_/g, " ");
}
