import type { PortfolioData } from "@/lib/data/portfolio";
import { StatusWindow } from "./StatusWindow";
import { WindowBar } from "./Window";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({
  profile,
  resumeAvailable,
}: {
  profile: PortfolioData["profile"];
  resumeAvailable: boolean;
}) {
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
        {resumeAvailable && <a href="/resume">RESUME</a>}
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
            <a className="retro-button" href="#contact">
              Get in touch <span>↗</span>
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
      <StatusWindow profile={profile} skills={data.skills} />
    </section>
  );
}
