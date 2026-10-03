import type { PortfolioData } from "@/lib/data/portfolio";
import { SectionTitle, WindowBar } from "./Window";

export function AboutSection({ data }: { data: PortfolioData }) {
  return (
    <section className="about-grid section-block" aria-labelledby="about">
      <div className="about-copy">
        <SectionTitle
          eyebrow="01 / A LITTLE ABOUT ME"
          title="Engineering with intent."
          id="about"
        />
        <p>{data.profile.bio}</p>
        <p>{data.profile.secondBio}</p>
        <a className="text-link" href="#contact">
          LET&apos;S CONNECT <span>↗</span>
        </a>
      </div>
      <div className="window skills-window">
        <WindowBar title="toolbox/skills" />
        <div className="skills-content">
          <div className="skills-label">
            <span>CORE TOOLKIT</span>
            <span>{data.skills.length} ITEMS</span>
          </div>
          <div className="skill-list">
            {data.skills.map((skill, index) => (
              <span
                className={`skill-chip ${index < 4 ? "skill-featured" : ""}`}
                key={`${skill}-${index}`}
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="skill-note">
            <span className="note-icon">i</span> Always learning. Currently
            exploring better ways to build resilient, high-traffic products.
          </div>
        </div>
      </div>
    </section>
  );
}
