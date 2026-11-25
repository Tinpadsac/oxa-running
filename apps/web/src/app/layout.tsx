import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Oxa Running 2027 | Corre • Respira • Conecta',
  description:
    'Reto de la Reserva de Biosfera en Oxapampa 2027. Preventa abierta, ruta oficial 12K y galería de la edición 2026.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-neutral-950 font-sans text-white antialiased">{children}</body>
    </html>
  );
}