// Root layout shared by every Next.js App Router page.

import type { Metadata } from "next";
import "./globals.css";

// Static metadata shown by the browser and crawlers.
export const metadata: Metadata = {
  title: "API IA Agent RAG",
  description: "Frontend para interação com a API IA Agent RAG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The application is authored in Brazilian Portuguese.
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
