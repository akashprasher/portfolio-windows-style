import type { Experience } from "@/lib/data/portfolio";
import { SectionTitle } from "./Window";

export function ExperienceSection({
  experience,
}: {
  experience: Experience[];
}) {
  return (
    <section className="section-block" aria-labelledby="experience">
      <SectionTitle
        eyebrow="02 / CAREER LOG"
        title="Experience"
        id="experience"
      />
      <div className="experience-list">
        {experience.map((job, index) => (
          <article
            className="window experience-card"
            key={`${job.company}-${index}`}
          >
            <div className="experience-index">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="experience-main">
              <div className="experience-topline">
                <h3>{job.company}</h3>
                <span className="job-dates">{job.dates}</span>
              </div>
              <div className="job-meta">
                <strong>{job.role}</strong>
                <span>{job.location}</span>
              </div>
              <ul>
                {job.points.map((point, pointIndex) => (
                  <li key={`${job.company}-${pointIndex}`}>{point}</li>
                ))}
              </ul>
            </div>
            <span className="card-corner" aria-hidden="true">
              ↗
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
