/**
 * Portfolio config — edita aquí sin tocar componentes.
 *
 * Videos: Bunny Stream (HLS). src = .../playlist.m3u8 · poster = .../thumbnail.jpg
 * (se reproducen con hls.js; nativo en Safari). Deja src:"" para el placeholder.
 * Los nombres de agente se quitaron: cada reel muestra solo precio + ubicación
 * (la "casa") — valores ilustrativos de listings South Florida.
 */
const BUNNY = 'https://vz-5c81264f-e6c.b-cdn.net';
const bunny = (guid: string) => ({ src: `${BUNNY}/${guid}/playlist.m3u8`, poster: `${BUNNY}/${guid}/thumbnail.jpg` });

export type Reel = {
  src: string;
  poster: string;
  price: string;
  location: string;
};

export type ResultCase = {
  reel: number; // índice en REELS (0 = el primero)
  metrics: { v: string; l: string }[];
};

/** Video de fondo del hero — solo se usa en móvil (clip vertical). HLS de Bunny. */
export const HERO_VIDEO = 'https://vz-5c81264f-e6c.b-cdn.net/8d38a86a-1140-405d-a0aa-baa8b4f274e8/playlist.m3u8';

export const REELS: Reel[] = [
  { ...bunny('52f27bf9-169d-438a-a18d-99bec2fbc37c'), price: '$6.9M', location: 'Singer Island' },
  { ...bunny('108c8d71-da1c-4253-b7ad-a64dde4d9193'), price: '$5.69M', location: 'Lighthouse Point' },
  { ...bunny('e0fc361a-32bf-404b-8a4b-7134be1cc495'), price: '$3.9M', location: 'Delray Beach' },
  { ...bunny('9d7d24e4-dba4-47b8-99d6-1571a417677c'), price: '$7M', location: 'Juno Beach' },
  { ...bunny('8be793e8-6ccb-4f08-8216-1bd86d83013a'), price: '$5.12M', location: 'Delray Beach' },
  { ...bunny('25928f12-a5a3-457b-8e92-038b1ef67f32'), price: '$5.5M', location: 'Plantation' },
  { ...bunny('cd605446-d2af-49bc-aa46-64234d9757fb'), price: '$3.9M', location: 'Palm Beach Gardens' },
  { ...bunny('7c33b387-6d96-4f4c-9b6c-ab3b0c240577'), price: '$6.2M', location: 'Fort Lauderdale' },
  { ...bunny('77742255-abaf-4b27-9ade-84e1edf2b47b'), price: '$4.8M', location: 'Boca Raton' },
  { ...bunny('ace6edf2-f871-4f2e-9c4e-65b416675876'), price: '$8.4M', location: 'Manalapan' },
  { ...bunny('d6a9410a-708e-41f8-8fd9-625bccc29609'), price: '$5.95M', location: 'Jupiter' },
  { ...bunny('b99f25c3-dcf0-4cc9-9273-64e44d7d7fb2'), price: '$4.5M', location: 'Highland Beach' },
];

export const RESULTS: ResultCase[] = [
  { reel: 0, metrics: [{ v: '2.4M', l: 'Views on one reel' }, { v: '+1,800', l: 'New followers' }, { v: '2', l: 'Listings won' }] },
  { reel: 3, metrics: [{ v: '890K', l: 'Views in 30 days' }, { v: '+1,200', l: 'New followers' }, { v: '14', l: 'Buyer leads' }] },
  { reel: 1, metrics: [{ v: '1.1M', l: 'Total reach' }, { v: '3x', l: 'Profile visits' }, { v: '1', l: '$5M+ listing won' }] },
];

/** cuántos reels se muestran al entrar y cuántos agrega cada "Load More" */
export const GRID_PAGE = 6;

/** WhatsApp — número en formato internacional sin + */
export const WA_NUMBER = '15615701414';
export const WA_MSG = 'Hi! I just saw the LuxeShots portfolio and I want my Content Day';

/** Calendario de Acuity (booking drawer) */
export const BOOKING_URL = 'https://luxeshots.as.me/';
