export default function Masthead() {
  return (
    <header className="e2-mast">
      <a href="#top" className="e2-mast__brand">LuxeShots</a>
      <span className="e2-mast__mid">Edition N°02</span>
      <nav className="e2-mast__links">
        <a className="e2-mast__link" href="#reserve">Dates</a>
        <a className="e2-mast__link" href="#work">Work</a>
        <a className="e2-mast__link" href="https://luxeshots.as.me/" target="_blank" rel="noopener noreferrer">Reserve</a>
      </nav>
    </header>
  );
}
