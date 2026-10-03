import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — Akash Prasher",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <header className="not-found-topbar">
        <Link
          className="not-found-brand"
          href="/"
          aria-label="Akash Prasher home"
        >
          <span className="not-found-brand-mark" aria-hidden="true">
            AP
          </span>
          <span>AKASH PRASHER</span>
        </Link>
        <span className="not-found-system-status">
          <span aria-hidden="true" />
          SYSTEM ONLINE
        </span>
      </header>

      <section className="not-found-window" aria-labelledby="not-found-title">
        <div className="not-found-titlebar">
          <span>
            <span aria-hidden="true">▣</span> C:\PORTFOLIO\ERROR.LOG
          </span>
          <span className="not-found-window-controls" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>

        <div className="not-found-content">
          <p className="not-found-eyebrow">HTTP STATUS // 404</p>
          <h1 id="not-found-title">Page not found.</h1>
          <p className="not-found-description">
            Looks like this address points to an empty directory. The page may
            have moved, or the link may be out of date.
          </p>

          <div className="not-found-code" aria-label="Error details">
            <span>&gt;</span> ROUTE_LOOKUP
            <strong>FAILED</strong>
            <br />
            <span>&gt;</span> DESTINATION
            <strong>NOT FOUND</strong>
          </div>

          <Link className="retro-button primary-button not-found-home" href="/">
            <span aria-hidden="true">←</span> Back to portfolio
          </Link>
        </div>

        <footer className="not-found-footer">
          AKASH PRASHER <span>·</span> PORTFOLIO SYSTEMS
        </footer>
      </section>

      <p className="not-found-footnote">NO DATA LOST · JUST A WRONG TURN</p>
    </main>
  );
}
