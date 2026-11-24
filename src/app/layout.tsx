import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VayuMitra | GenAI Urban Air Quality & Winter Smog Assistant',
  description: 'AI-powered companion helping families navigate severe winter smog with personalized low-emission routines, indoor air hacks, and sustainable impact quantification.',
  keywords: ['Air Quality', 'AQI', 'Delhi Smog', 'Winter Pollution', 'GenAI', 'Low Emission Routines', 'Indoor Air Quality', 'CPCB India'],
  authors: [{ name: 'Asmita Karmakar' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
