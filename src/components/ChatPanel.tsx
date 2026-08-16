"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, SendHorizontal, UserRound } from "lucide-react";
import type { ChatResponse } from "@/lib/types";
import { formatHumanText, normalizeMessageForApi } from "@/lib/text";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  sources?: ChatResponse["sources"];
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Ola. Sou o assistente de atendimento. Escolha uma opcao pelo numero ou digite sua duvida.\n\n1. Como funciona a devolucao de um pedido?\n2. Quais canais de atendimento estao disponiveis?\n3. O que fazer em caso de entrega com avaria?",
  },
];

const SUGGESTIONS = [
  "Como funciona a devolucao de um pedido?",
  "Quais canais de atendimento estao disponiveis?",
  "O que fazer em caso de entrega com avaria?",
];

export function ChatPanel() {
  // Estado local do chatbot: entrada atual, historico visual e feedback de carregamento.
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Mantem a conversa sempre posicionada na mensagem mais recente.
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  async function sendMessage(question: string) {
    if (isLoading) return;

    const selectedQuestion = resolveSuggestedQuestion(question);
    const apiQuestion = normalizeMessageForApi(selectedQuestion);
    const displayQuestion = formatHumanText(selectedQuestion);
    if (!apiQuestion || !displayQuestion) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: displayQuestion,
    };

    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);
    setError(null);
    setMessage("");

    try {
      // O frontend chama a rota proxy do Next, que encaminha a requisicao para a API Python.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: buildQuestionWithContext(messages, apiQuestion),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.detail?.detail ?? payload?.message ?? "Nao foi possivel enviar sua mensagem.");
      }

      const result = payload as ChatResponse;

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: formatHumanText(result.answer),
          sources: result.sources,
        },
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    sendMessage(message.trim());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter envia a mensagem; Shift + Enter continua permitindo quebra de linha.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (isLoading) return;
      sendMessage(message.trim());
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-238px)] flex-col overflow-hidden rounded-lg border border-white/80 bg-white/95 shadow-soft backdrop-blur sm:min-h-[700px]">
      <div className="border-b border-ink/8 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean to-ink text-white shadow-sm">
            <Bot className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-ink sm:text-xl">Assistente virtual</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 text-xs font-bold text-ink">
                <span className="h-2 w-2 rounded-full bg-ocean" />
                Online
              </span>
            </div>
            <p className="text-sm text-ink/62">Atendimento com base nos documentos oficiais.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(235,247,239,0.55))] px-4 py-5 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-5 pb-2">
          {messages.map((item) => (
            <ChatBubble key={item.id} message={item} />
          ))}

          {isLoading && (
            <div className="flex items-end gap-3">
              <Avatar role="assistant" />
              <div className="rounded-2xl rounded-bl-md border border-ink/8 bg-white px-4 py-3 text-sm text-ink/70 shadow-sm">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-ocean" aria-hidden />
                  Consultando...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-ink/10 bg-white/95 p-4 sm:p-5">
        <div className="mx-auto max-w-4xl">
          {messages.length === INITIAL_MESSAGES.length && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                disabled={isLoading}
                className="shrink-0 rounded-full border border-ink/10 bg-mint/35 px-3 py-2 text-xs font-semibold text-ink/70 transition hover:border-ocean hover:bg-white hover:text-ocean disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
          )}

          {error && (
            <p className="mb-3 rounded-lg bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-lg border border-ink/10 bg-white p-2 shadow-sm focus-within:border-ocean focus-within:ring-4 focus-within:ring-ocean/10">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              maxLength={4000}
              rows={1}
              className="max-h-32 min-h-11 flex-1 resize-none rounded-lg border-0 bg-transparent px-3 py-3 text-sm text-ink outline-none disabled:text-ink/45"
              placeholder="Digite 1, 2, 3 ou escreva sua duvida..."
            />
            <button
              type="submit"
              aria-label="Enviar mensagem"
              disabled={isLoading || !message.trim()}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white shadow-sm transition hover:bg-ocean disabled:bg-ink/35"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <SendHorizontal className="h-4 w-4" aria-hidden />
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function resolveSuggestedQuestion(question: string) {
  const option = question.trim();
  const suggestionIndex = Number(option) - 1;

  if (
    Number.isInteger(suggestionIndex)
    && suggestionIndex >= 0
    && suggestionIndex < SUGGESTIONS.length
  ) {
    return SUGGESTIONS[suggestionIndex];
  }

  return question;
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  // Separa a apresentacao das mensagens do usuario e das respostas da IA.
  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar role="assistant" />}
      <div className={`${isUser ? "order-1 max-w-[82%] sm:max-w-[68%]" : "max-w-[92%] sm:max-w-[82%]"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? "rounded-tr-md bg-gradient-to-br from-ink to-ocean text-white"
              : "rounded-tl-md border border-ink/8 bg-white text-ink/84 ring-1 ring-white"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap font-semibold">{message.content}</p>
          ) : (
            <RichText value={message.content} />
          )}
        </div>
      </div>
      {isUser && <Avatar role="user" />}
    </div>
  );
}

function RichText({ value }: { value: string }) {
  // Converte respostas longas em blocos mais legiveis, sem alterar o texto original da API.
  const lines = value.split("\n").filter(Boolean);

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith("- ");
        const isNumbered = /^\d+\.\s/.test(trimmed);

        if (isBullet) {
          return (
            <div key={`${trimmed}-${index}`} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ocean" />
              <p>{trimmed.slice(2)}</p>
            </div>
          );
        }

        if (isNumbered) {
          const number = trimmed.match(/^\d+/)?.[0] ?? "";
          return (
            <div key={`${trimmed}-${index}`} className="flex gap-3 rounded-lg bg-mint/35 px-3 py-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocean text-xs font-black text-white">
                {number}
              </span>
              <p className="font-semibold text-ink">{trimmed.replace(/^\d+\.\s/, "")}</p>
            </div>
          );
        }

        return (
          <p key={`${trimmed}-${index}`} className="text-ink/82">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

function buildQuestionWithContext(history: ChatMessage[], currentQuestion: string) {
  // Envia as ultimas mensagens junto da pergunta atual para suportar respostas curtas como "sim".
  const conversation = history
    .filter((item) => item.id !== "welcome")
    .slice(-6)
    .map((item) => {
      const role = item.role === "user" ? "Usuario" : "Assistente";
      return `${role}: ${item.content}`;
    });

  if (conversation.length === 0) {
    return currentQuestion;
  }

  return [
    "Considere o historico da conversa para responder de forma contextual.",
    "",
    "Historico:",
    ...conversation,
    "",
    `Mensagem atual do usuario: ${currentQuestion}`,
  ].join("\n");
}

function Avatar({ role }: { role: ChatMessage["role"] }) {
  const Icon = role === "user" ? UserRound : Bot;

  // Avatar visual simples para orientar rapidamente quem falou na conversa.
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
        role === "user" ? "bg-ocean text-white" : "bg-coral/12 text-coral"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </div>
  );
}
