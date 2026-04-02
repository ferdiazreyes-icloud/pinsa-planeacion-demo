import type { Metadata } from "next";
import "./globals.css";
import SidebarLayout from "@/components/layout/SidebarLayout";

export const metadata: Metadata = {
  title: "PINSA | Torre de Control de Planeación",
  description: "Plataforma S&OP/IBP para la orquestación de la cadena de valor PINSA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
