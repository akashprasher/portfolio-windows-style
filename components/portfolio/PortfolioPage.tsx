import type { PortfolioData } from "@/lib/data/portfolio";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { ExperienceSection } from "./ExperienceSection";
import { HeroSection, SiteHeader } from "./HeroSection";
import { ProjectsSection } from "./ProjectsSection";

export function PortfolioPage({ data }: { data: PortfolioData }) {
  return (
    <main className="desktop-shell">
      <SiteHeader profile={data.profile} />
      <HeroSection data={data} />
      <AboutSection data={data} />
      <ExperienceSection experience={data.experience} />
      <ProjectsSection projects={data.projects} />
      <ContactSection data={data} />
      <footer className="taskbar">
        <a className="start-button" href="#home">
          <span className="brand-mark mini-mark">AP</span> AKASH
        </a>
        <div className="taskbar-center">
          <span>© 2026 {data.profile.name.toUpperCase()}</span>
          <span>DESIGNED TO SHIP.</span>
        </div>
        <a className="email-shortcut" href={`mailto:${data.profile.email}`}>
          ✉ <span>{data.profile.email}</span>
        </a>
      </footer>
    </main>
  );
}
