/**
 * Portfolio config — edita aquí sin tocar componentes.
 *
 * Videos: Bunny Stream (con MP4 Fallback activado):
 *   src:    https://vz-XXXXXX.b-cdn.net/VIDEO_GUID/play_720p.mp4
 *   poster: https://vz-XXXXXX.b-cdn.net/VIDEO_GUID/thumbnail.jpg
 * Deja src:"" para mantener el placeholder de la tarjeta.
 */

export type Reel = {
  src: string;
  poster: string;
  agent: string;
  price: string;
  location: string;
};

export type ResultCase = {
  reel: number; // índice en REELS (0 = el primero)
  metrics: { v: string; l: string }[];
};

export const HERO_VIDEO = '';

export const REELS: Reel[] = [
  { src: '', poster: '', agent: 'Andrea Mamane', price: '$6.9M', location: 'Singer Island' },
  { src: '', poster: '', agent: 'JJ Lambert', price: '$5.69M', location: 'Lighthouse Point' },
  { src: '', poster: '', agent: 'Kelly Louis', price: '$3.9M', location: 'Delray Beach' },
  { src: '', poster: '', agent: 'Jacob Edri', price: '$7M', location: 'Juno Beach' },
  { src: '', poster: '', agent: 'Agent Name', price: '$5.12M', location: 'Delray Beach' },
  { src: '', poster: '', agent: 'Agent Name', price: '$5.5M', location: 'Plantation' },
  { src: '', poster: '', agent: 'Agent Name', price: '$3.9M', location: 'Palm Beach Gardens' },
  { src: '', poster: '', agent: 'Agent Name', price: '$6.2M', location: 'South Florida' },
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
