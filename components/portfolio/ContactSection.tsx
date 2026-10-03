import type { PortfolioData } from "@/lib/data/portfolio";
import { WindowBar } from "./Window";

export function ContactSection({ data }: { data: PortfolioData }) {
  return (
    <section className="bottom-grid section-block">
      <article className="window education-window">
        <WindowBar title="education.log" />
        <div className="education-content">
          <span className="eyebrow">04 / EDUCATION</span>
          <h3>{data.education.school}</h3>
          <p>
            {data.education.degree}
            <br />
            {data.education.program}
          </p>
          <span className="education-year">{data.education.dates}</span>
        </div>
      </article>
      <article className="contact-card" id="contact">
        <div className="contact-spark" aria-hidden="true">
          ✳
        </div>
        <span className="eyebrow">05 / YOUR NEXT MOVE</span>
        <h2>
          Have a good problem
          <br />
          to solve?
        </h2>
        <p>
          I&apos;m always happy to talk about thoughtful products, engineering,
          and new opportunities.
        </p>
        <a
          className="retro-button contact-button"
          href={`mailto:${data.profile.email}`}
        >
          Email me <span>↗</span>
        </a>
        <div className="contact-details">
          <a href={`tel:${data.profile.phone.replace(/[^+\d]/g, "")}`}>
            {data.profile.phone}
          </a>
          <a
            href={`https://${data.profile.website.replace(/^https?:\/\//, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            {data.profile.website}
          </a>
        </div>
      </article>
    </section>
  );
}
