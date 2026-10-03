import type { Project } from "@/lib/data/portfolio";
import { SectionTitle, WindowBar } from "./Window";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section
      className="section-block projects-section"
      aria-labelledby="projects"
    >
      <div className="section-title-row">
        <SectionTitle
          eyebrow="03 / SELECTED BUILDS"
          title="A few things I've made."
          id="projects"
        />
        <span className="section-count">
          {projects.length} PROJECTS <b>———</b>
        </span>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => {
          const card = (
            <>
              <WindowBar
                title={`project_${String(index + 1).padStart(2, "0")}.app`}
              />
              <div className="project-body">
                <div className={`project-art art-${project.color}`}>
                  <span className="project-art-icon">{project.icon}</span>
                  <span className="art-grid" />
                </div>
                <div className="project-type">{project.type}</div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-stack">{project.stack}</div>
              </div>
              <div className="project-footer">
                <span>{project.url ? "VIEW PROJECT" : "FEATURED PROJECT"}</span>
                <span className="project-arrow">↗</span>
              </div>
            </>
          );
          return project.url ? (
            <a
              className="window project-card"
              key={`${project.name}-${index}`}
              href={project.url}
              target="_blank"
              rel="noreferrer"
            >
              {card}
            </a>
          ) : (
            <article
              className="window project-card"
              key={`${project.name}-${index}`}
            >
              {card}
            </article>
          );
        })}
      </div>
    </section>
  );
}
