import type { Metadata } from 'next';

/** Ruta /portfolio — fuera del route group (site), así NO hereda el chrome de
 *  V1 (Nav, cursor, grain, Lenis, preloader). Solo trae el root layout (fuentes
 *  + globals). Aquí viven los meta OG del portafolio. */
export const metadata: Metadata = {
  title: 'The Work — LuxeShots Content Days',
  description: 'Every frame, shot where luxury actually lives. Viral reels filmed inside multimillion-dollar listings across South Florida.',
  openGraph: {
    title: 'The Work — LuxeShots Content Days',
    description: 'Viral reels filmed inside multimillion-dollar listings across South Florida.',
    type: 'website',
    url: 'https://luxeshots.com/portfolio',
    images: [{ url: 'https://luxeshots.com/og-cover.jpg' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
