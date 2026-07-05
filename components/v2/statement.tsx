export default function Statement() {
  return (
    <section className="e2-sec e2-light e2-statement">
      <div className="e2-wrap e2-statement__row">
        <span className="e2-statement__n" data-slide>01</span>
        <div>
          <span className="e2-kick" data-slide data-delay="40">Statement</span>
          <p data-slide data-delay="90" style={{ marginTop: '1.2rem' }}>
            Content that doesn&rsquo;t just look expensive — content that <b>converts</b>.
          </p>
          <small data-fade data-delay="260">
            Every Luxe Content Day is directed end to end: a styling consultation, a multimillion-dollar
            location, premium headshots and vertical reels engineered to stop the scroll. One session, a
            complete library — yours to keep.
          </small>
        </div>
      </div>
    </section>
  );
}
