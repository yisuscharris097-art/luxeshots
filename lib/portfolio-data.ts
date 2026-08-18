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

/** Video de fondo del hero. HLS de Bunny. Vacío = gradiente placeholder.
 *  HERO_VIDEO = clip horizontal (desktop) · HERO_VIDEO_MOBILE = clip vertical (móvil). */
export const HERO_VIDEO: string = 'https://vz-5c81264f-e6c.b-cdn.net/ab6066bd-f97c-457d-815f-329a2b8ccb3b/playlist.m3u8';
export const HERO_VIDEO_MOBILE: string = 'https://vz-5c81264f-e6c.b-cdn.net/ba10704c-6539-442a-b2a6-6d5f91c2449a/playlist.m3u8';

export const REELS: Reel[] = [
  { ...bunny('7021aa35-d776-428e-a785-d2f23e7e7ff6'), price: '$3.9M', location: 'Palm Beach Gardens' },
  { ...bunny('522f826c-86e4-4349-95fb-2f385cc285bd'), price: '$6.2M', location: 'Fort Lauderdale' },
  { ...bunny('107abb90-68a6-4b66-b00a-c7cfa788594a'), price: '$4.8M', location: 'Boca Raton' },
  { ...bunny('433757ff-3b2b-4c89-bee9-c09eca53a1ec'), price: '$6.9M', location: 'Singer Island' },
  { ...bunny('f6cc6bc5-ad0d-48d1-92a7-fc7e321dc68a'), price: '$5.69M', location: 'Lighthouse Point' },
  { ...bunny('d4ca987c-d4dd-42ab-b7dc-0644b592c253'), price: '$3.9M', location: 'Delray Beach' },
  { ...bunny('55d8902d-be63-4352-8f4d-633117c7dd83'), price: '$7M', location: 'Juno Beach' },
  { ...bunny('dd275487-0d04-47e8-b2f4-e7eed5eeb11a'), price: '$5.12M', location: 'Delray Beach' },
  { ...bunny('a61cce6b-6969-46fb-b695-14952002ad58'), price: '$5.5M', location: 'Plantation' },
  { ...bunny('f5a91cc1-8ace-4465-acd2-dd6f40a7c93f'), price: '$8.4M', location: 'Manalapan' },
  { ...bunny('2acbd4d5-0735-40f5-949c-ffa4c0e2666f'), price: '$5.95M', location: 'Jupiter' },
  { ...bunny('5bae27f0-49ad-4f01-a84b-24f59a57e815'), price: '$4.5M', location: 'Highland Beach' },
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

/* ===================================================================
   THE SIGNATURE REEL  (sección nueva)
   ===================================================================
   DÓNDE VAN LOS VIDEOS: coloca los archivos .mp4 (verticales 9:16) en
   la carpeta  /public/videos/  del repo (créala si no existe). Luego
   pon aquí SOLO la ruta pública, que empieza en "/videos/...".
   Ej: un archivo en  public/videos/signature-reel.mp4  se referencia
   como  '/videos/signature-reel.mp4'.  Vacío ('') = placeholder.
=================================================================== */

/** Reel protagonista del showcase (vertical 9:16). */
export const SIGNATURE_REEL = { video: '', poster: '' };

/** 3 video testimonials (verticales 9:16).
 *  Para reemplazarlos: cambia SOLO `video` y `poster` (y luego las
 *  cifras de `metric`/nombres). El layout no se toca. */
export type Testimonial = {
  video: string;    // ruta al mp4 vertical, ej '/videos/testimonial-1.mp4' (vacío = placeholder)
  poster: string;   // thumbnail, ej '/videos/testimonial-1.jpg'
  name: string;     // nombre del agente
  brokerage: string;// brokerage
  metric: string;   // métrica dura (se muestra en dorado)
};
export const TESTIMONIALS: Testimonial[] = [
  { video: '', poster: '', name: 'Agent Name', brokerage: 'Brokerage', metric: '127K views in 9 days' },
  { video: '', poster: '', name: 'Agent Name', brokerage: 'Brokerage', metric: '3 listing leads in week one' },
  { video: '', poster: '', name: 'Agent Name', brokerage: 'Brokerage', metric: '+2,400 followers' },
];
