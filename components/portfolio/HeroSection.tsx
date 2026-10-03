import type { PortfolioData } from "@/lib/data/portfolio";
import { WindowBar } from "./Window";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({ profile }: { profile: PortfolioData["profile"] }) {
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label={`${profile.name} home`}>
        <span className="brand-mark">AP</span>
        <span>{profile.name.toUpperCase()}</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#about">ABOUT</a>
        <a href="#experience">EXPERIENCE</a>
        <a href="#projects">PROJECTS</a>
        <a href="#contact">CONTACT</a>
      </nav>
      <ThemeToggle />
    </header>
  );
}

export function HeroSection({ data }: { data: PortfolioData }) {
  const { profile } = data;
  return (
    <section className="hero-grid" id="home">
      <article className="window hero-window">
        <WindowBar title="welcome.exe" />
        <div className="hero-content">
          <div className="hero-kicker">
            <span className="prompt-mark">&gt;_</span>{" "}
            {profile.title.toUpperCase()} · {profile.location.toUpperCase()}
          </div>
          <h1>
            Building useful
            <br />
            <span>things for people.</span>
          </h1>
          <p className="hero-copy">{profile.intro}</p>
          <div className="hero-actions">
            <a className="retro-button primary-button" href="#projects">
              Explore my work <span>↘</span>
            </a>
            <a className="retro-button" href={`mailto:${profile.email}`}>
              Send me a message <span>↗</span>
            </a>
          </div>
          <div className="hero-meta">
            <span>
              <i className="tiny-square" /> 4+ YEARS BUILDING
            </span>
            <span>
              <i className="tiny-square blue-square" /> FULL-STACK ENGINEER
            </span>
          </div>
        </div>
      </article>
      <aside className="window status-window">
        <WindowBar title="system_status.txt" />
        <div className="status-content">
          <div className="profile-stamp" aria-hidden="true">
            <span className="stamp-sun">✳</span>
            <span className="stamp-initials">AP</span>
            <span className="stamp-caption">BUILD / SHIP / REPEAT</span>
          </div>
          <div className="status-line">
            <span>CURRENT ROLE</span>
            <strong>{profile.currentRole}</strong>
          </div>
          <div className="status-line">
            <span>LOCATION</span>
            <strong>
              {profile.location} <em>IST · UTC+5:30</em>
            </strong>
          </div>
          <div className="status-line">
            <span>STATUS</span>
            <strong className="online">
              <i className="status-dot" /> {profile.status}
            </strong>
          </div>
          <div className="stats-row">
            <div>
              <strong>{profile.paymentStat}</strong>
              <small>PAYMENTS POWERED</small>
            </div>
            <div>
              <strong>{profile.retentionStat}</strong>
              <small>RETENTION LIFT</small>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
