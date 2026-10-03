import type { PortfolioData } from "@/lib/data/portfolio";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { ExperienceSection } from "./ExperienceSection";
import { HeroSection, SiteHeader } from "./HeroSection";
import { ProjectsSection } from "./ProjectsSection";
import { EasterEggProvider } from "./EasterEgg";
import { WindowManagerProvider, WindowTaskbar } from "./WindowManager";

export function PortfolioPage({ data }: { data: PortfolioData }) {
  return (
    <EasterEggProvider
      name={data.profile.name}
      intro={data.profile.intro}
      bio={data.profile.bio}
      secondBio={data.profile.secondBio}
      skills={data.skills}
      resumeAvailable={Boolean(data.resumeUrl)}
    >
      <WindowManagerProvider>
        <main className="desktop-shell">
          <SiteHeader
            profile={data.profile}
            resumeAvailable={Boolean(data.resumeUrl)}
          />
          <HeroSection data={data} />
          <AboutSection data={data} />
          <ExperienceSection experience={data.experience} />
          <ProjectsSection projects={data.projects} />
          <ContactSection data={data} />
          <footer className="taskbar">
            <a className="start-button" href="#home">
              <span className="brand-mark mini-mark">AP</span> AKASH
            </a>
            <WindowTaskbar />
            <div className="taskbar-center">
              <span>© 2026 {data.profile.name.toUpperCase()}</span>
              <span>DESIGNED TO SHIP.</span>
            </div>
            {data.resumeUrl && (
              <a className="footer-resume-link" href="/resume">
                RESUME <span aria-hidden="true">↗</span>
              </a>
            )}
          </footer>
        </main>
        <aside
          className="site-progress-stamp"
          aria-label="Website status: in progress and always improving"
        >
          <span className="site-progress-mark" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M3 17h14M5 17l3-11h4l3 11M7 10h6M8 7h4" />
              <path d="M7 3.5h6M10 2v2" />
            </svg>
          </span>
          <span className="site-progress-copy">
            <strong>SITE IN PROGRESS</strong>
            <small>ALWAYS IMPROVING</small>
          </span>
        </aside>
      </WindowManagerProvider>
    </EasterEggProvider>
  );
}
