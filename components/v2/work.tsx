import ColorVideo from './mono-video';

const HOST = 'https://vz-5c81264f-e6c.b-cdn.net';
const REELS = [
  { name: 'Andrea Mamane', url: `${HOST}/6a0a2269-14fc-452c-b1a8-c102616ad477/playlist.m3u8` },
  { name: 'JJ Lambert',    url: `${HOST}/bfe5d383-bfd2-46cf-8053-95401c06190e/playlist.m3u8` },
  { name: 'Kelly Louis',   url: `${HOST}/e8a7988a-c2c3-42fa-844f-c04bb5cd655e/playlist.m3u8` },
  { name: 'Jacob Edri',    url: `${HOST}/7621b373-5a25-4f82-923c-785972dd7344/playlist.m3u8` },
];

export default function Work() {
  return (
    <section className="e2-sec e2-tint" id="work">
      <div className="e2-wrap">
        <div className="e2-work__head">
          <div>
            <span className="e2-kick" data-slide>03 — The Work</span>
            <h2 className="e2-disp e2-xl" data-slide data-delay="60" style={{ marginTop: '1.2rem' }}>
              What is your content saying about you?
            </h2>
          </div>
          <p className="e2-lede" data-fade data-delay="150" style={{ maxWidth: '22rem' }}>
            Vertical reels, directed for realtors. Tap any to play it with sound.
          </p>
        </div>

        <div className="e2-reels">
          {REELS.map((r, i) => (
            <figure className="e2-reel" data-slide data-delay={i * 90} key={i}>
              <div className="e2-reel__media">
                <ColorVideo src={r.url} className="fill" />
              </div>
              <figcaption className="e2-reel__cap">
                <span className="e2-reel__name">{r.name}</span>
                <span className="e2-reel__n">N°0{i + 1}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
