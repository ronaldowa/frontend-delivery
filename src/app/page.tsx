"use client";

import { useState } from "react";
import { FileText, MessageSquareText } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";
import { RagTestPanel } from "@/components/RagTestPanel";

type Tab = "chat" | "rag";

export default function Home() {
  // Controla a troca entre o chatbot principal e a consulta direta aos documentos.
  const [tab, setTab] = useState<Tab>("chat");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-7 lg:px-8">
      <header className="relative overflow-hidden rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ocean via-amber to-coral" />
        <div>
          {/* <p className="text-xs font-black uppercase tracking-[0.18em] text-ocean">Mercado Central 24h</p> */}
          <h1 className="mt-2 max-w-3xl text-2xl font-black leading-tight text-ink sm:text-4xl">
            Assistente inteligente de atendimento
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/68 sm:text-base">
            Consulte orientacoes sobre pedidos, atendimento, fornecedores, trocas e procedimentos operacionais.
          </p>
        </div>
      </header>

      <nav
        role="tablist"
        aria-label="Navegacao principal"
        className="grid grid-cols-2 gap-2 rounded-lg border border-white/70 bg-white/80 p-1.5 shadow-sm backdrop-blur sm:w-fit"
      >
        <TabButton
          active={tab === "chat"}
          controls="chat-panel"
          onClick={() => setTab("chat")}
          icon={<MessageSquareText className="h-4 w-4" aria-hidden />}
        >
          Assistente
        </TabButton>
        <TabButton
          active={tab === "rag"}
          controls="rag-panel"
          onClick={() => setTab("rag")}
          icon={<FileText className="h-4 w-4" aria-hidden />}
        >
          Documentos
        </TabButton>
      </nav>

      {/* Mantem os fluxos separados para preservar uma experiencia simples para o usuario. */}
      <div
        id={tab === "chat" ? "chat-panel" : "rag-panel"}
        role="tabpanel"
        aria-label={tab === "chat" ? "Assistente" : "Documentos"}
      >
        {tab === "chat" ? <ChatPanel /> : <RagTestPanel />}
      </div>
    </main>
  );
}

type TabButtonProps = {
  active: boolean;
  children: React.ReactNode;
  controls: string;
  icon: React.ReactNode;
  onClick: () => void;
};

function TabButton({ active, children, controls, icon, onClick }: TabButtonProps) {
  // Botao reaproveitado para manter o mesmo comportamento visual nas abas.
  return (
    <button
      role="tab"
      type="button"
      aria-controls={controls}
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-ink text-white shadow-sm"
          : "bg-transparent text-ink/62 hover:bg-white hover:text-ink"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
