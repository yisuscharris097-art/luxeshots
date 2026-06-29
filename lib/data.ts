import schedule from '@/data/schedule.json';
import team from '@/data/team.json';
import faq from '@/data/faq.json';
import reviews from '@/data/reviews.json';
import brand from '@/data/brand.json';

const fixImg = (p?: string) => (p ? p.replace(/^assets\/images\//, '/images/') : '');

export type ContentDay = {
  index: number; date: string; type: string; price?: string; city?: string;
  commercial?: boolean; address?: string; rsvp?: string; image: string;
};

export const contentDays: ContentDay[] = (schedule as any[])
  .filter((s) => s.type === 'content-day')
  .map((s) => ({ ...s, image: fixImg(s.image) }));

export const events = (schedule as any[]).filter((s) => s.type === 'event')
  .map((s) => ({ ...s, image: fixImg(s.image) }));

export const teamReels = (team as any[]).map((t) => ({ ...t, image: fixImg(t.image) }));
export const faqs = faq as { q: string; a: string }[];
export const reviewsData = reviews as {
  rating: number; count: number; source: string; aiSummary: string;
  items: { name: string; date: string; stars: number; text: string }[];
};
export const brandData = brand as any;
