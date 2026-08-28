import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: 'ADAI Cockpit Builder — Qualifiez votre besoin digital',
  description:
    'Configurez votre cockpit de pilotage ADAI : qualification, sélection de domaines et modules, recommandation de pack et ROI client.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans bg-background text-foreground min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
