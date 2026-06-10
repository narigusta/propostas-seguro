import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proposta de Seguro",
  description: "Sistema de Propostas de Seguro Auto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
