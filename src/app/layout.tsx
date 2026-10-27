import type { Metadata } from 'next';
import './globals.css';
import { AppStateProvider } from '@/lib/store/appState';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'MOTIVE LAB | Ecosistema de Fisiología, Nutrición SMAE y Fuerza',
  description: 'Plataforma profesional de prescripción deportiva y nutricional basada en evidencia clínica, ACSM 2026, ISSN y Sistema Mexicano de Alimentos Equivalentes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-motive-bg text-zinc-100 flex flex-col antialiased">
        <AppStateProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AppStateProvider>
      </body>
    </html>
  );
}
