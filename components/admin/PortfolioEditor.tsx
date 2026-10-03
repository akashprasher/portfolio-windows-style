"use client";

import { FormEvent, useState } from "react";
import { savePortfolioData } from "@/app/admin/actions";
import type { Experience, PortfolioData, Project } from "@/lib/data/portfolio";

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  description,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: "text" | "url";
  description?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {description && (
        <small className="admin-field-description">{description}</small>
      )}
    </label>
  );
}

const blankExperience: Experience = {
  company: "",
  location: "",
  dates: "",
  role: "",
  points: [""],
};
const blankProject: Project = {
  name: "",
  type: "",
  stack: "",
  description: "",
  icon: "✳",
  color: "blue",
  url: "",
};

export function PortfolioEditor({
  initialData,
}: {
  initialData: PortfolioData;
}) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function setProfile(key: keyof PortfolioData["profile"], value: string) {
    setData((current) => ({
      ...current,
      profile: { ...current.profile, [key]: value },
    }));
  }
  function setResumeUrl(value: string) {
    setData((current) => ({ ...current, resumeUrl: value }));
  }
  function setExperience(
    index: number,
    key: keyof Experience,
    value: string | string[],
  ) {
    setData((current) => ({
      ...current,
      experience: current.experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  }
  function setProject(index: number, key: keyof Project, value: string) {
    setData((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) =>
        itemIndex === index ? ({ ...item, [key]: value } as Project) : item,
      ),
    }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const result = await savePortfolioData(data);
    setMessage(result.message);
    setBusy(false);
  }

  return (
    <form className="portfolio-editor" onSubmit={handleSave}>
      <div className="editor-savebar">
        <div>
          <span className="eyebrow">CONTENT MANAGER</span>
          <h1>Edit portfolio</h1>
          <p>Changes go live on the public portfolio when you save.</p>
        </div>
        <button className="retro-button primary-button" disabled={busy}>
          {busy ? "Publishing…" : "Save & publish ↗"}
        </button>
      </div>
      {message && (
        <div
          className={`admin-notice ${message.startsWith("Saved") ? "success-notice" : "error-notice"}`}
          role="status"
        >
          {message}
        </div>
      )}

      <section className="admin-section window" id="profile-editor">
        <div className="admin-section-title">
          <span>01</span>
          <div>
            <h2>Profile</h2>
            <p>Intro, contact details, resume link, and highlight stats.</p>
          </div>
        </div>
        <div className="admin-fields-grid">
          <Field
            label="Name"
            value={data.profile.name}
            onChange={(value) => setProfile("name", value)}
          />
          <Field
            label="Role / title"
            value={data.profile.title}
            onChange={(value) => setProfile("title", value)}
          />
          <Field
            label="Current role"
            value={data.profile.currentRole}
            onChange={(value) => setProfile("currentRole", value)}
          />
          <Field
            label="Location"
            value={data.profile.location}
            onChange={(value) => setProfile("location", value)}
          />
          <Field
            label="Email"
            value={data.profile.email}
            onChange={(value) => setProfile("email", value)}
          />
          <Field
            label="Phone"
            value={data.profile.phone}
            onChange={(value) => setProfile("phone", value)}
          />
          <Field
            label="Website"
            value={data.profile.website}
            onChange={(value) => setProfile("website", value)}
          />
          <Field
            label="Status label"
            value={data.profile.status}
            onChange={(value) => setProfile("status", value)}
          />
          <Field
            label="Resume document URL"
            value={data.resumeUrl ?? ""}
            onChange={setResumeUrl}
            type="url"
            description="Use a public Google Docs/Drive or Microsoft OneDrive/SharePoint sharing link. The public /resume route redirects here."
          />
          <Field
            label="Hero intro"
            value={data.profile.intro}
            onChange={(value) => setProfile("intro", value)}
            multiline
          />
          <Field
            label="About paragraph 1"
            value={data.profile.bio}
            onChange={(value) => setProfile("bio", value)}
            multiline
          />
          <Field
            label="About paragraph 2"
            value={data.profile.secondBio}
            onChange={(value) => setProfile("secondBio", value)}
            multiline
          />
          <Field
            label="Payment statistic"
            value={data.profile.paymentStat}
            onChange={(value) => setProfile("paymentStat", value)}
          />
          <Field
            label="Retention statistic"
            value={data.profile.retentionStat}
            onChange={(value) => setProfile("retentionStat", value)}
          />
        </div>
      </section>

      <section className="admin-section window" id="experience-editor">
        <div className="admin-section-title">
          <span>02</span>
          <div>
            <h2>Experience</h2>
            <p>Add, update, reorder, or remove roles.</p>
          </div>
          <button
            type="button"
            className="retro-button add-button"
            onClick={() =>
              setData((current) => ({
                ...current,
                experience: [...current.experience, { ...blankExperience }],
              }))
            }
          >
            ＋ Add role
          </button>
        </div>
        <div className="repeat-list">
          {data.experience.map((job, index) => (
            <article className="repeat-card" key={`experience-${index}`}>
              <div className="repeat-card-heading">
                <strong>ROLE {String(index + 1).padStart(2, "0")}</strong>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() =>
                    setData((current) => ({
                      ...current,
                      experience: current.experience.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
              <div className="admin-fields-grid">
                <Field
                  label="Company"
                  value={job.company}
                  onChange={(value) => setExperience(index, "company", value)}
                />
                <Field
                  label="Role"
                  value={job.role}
                  onChange={(value) => setExperience(index, "role", value)}
                />
                <Field
                  label="Location"
                  value={job.location}
                  onChange={(value) => setExperience(index, "location", value)}
                />
                <Field
                  label="Dates"
                  value={job.dates}
                  onChange={(value) => setExperience(index, "dates", value)}
                />
                <Field
                  label="Achievements (one per line)"
                  value={job.points.join("\n")}
                  onChange={(value) =>
                    setExperience(
                      index,
                      "points",
                      value.split("\n").filter(Boolean),
                    )
                  }
                  multiline
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section window" id="projects-editor">
        <div className="admin-section-title">
          <span>03</span>
          <div>
            <h2>Projects</h2>
            <p>Project cards and optional external links.</p>
          </div>
          <button
            type="button"
            className="retro-button add-button"
            onClick={() =>
              setData((current) => ({
                ...current,
                projects: [...current.projects, { ...blankProject }],
              }))
            }
          >
            ＋ Add project
          </button>
        </div>
        <div className="repeat-list">
          {data.projects.map((project, index) => (
            <article className="repeat-card" key={`project-${index}`}>
              <div className="repeat-card-heading">
                <strong>PROJECT {String(index + 1).padStart(2, "0")}</strong>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() =>
                    setData((current) => ({
                      ...current,
                      projects: current.projects.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
              <div className="admin-fields-grid">
                <Field
                  label="Name"
                  value={project.name}
                  onChange={(value) => setProject(index, "name", value)}
                />
                <Field
                  label="Category"
                  value={project.type}
                  onChange={(value) => setProject(index, "type", value)}
                />
                <Field
                  label="Tech stack"
                  value={project.stack}
                  onChange={(value) => setProject(index, "stack", value)}
                />
                <Field
                  label="External URL (optional)"
                  value={project.url}
                  onChange={(value) => setProject(index, "url", value)}
                />
                <Field
                  label="Description"
                  value={project.description}
                  onChange={(value) => setProject(index, "description", value)}
                  multiline
                />
                <Field
                  label="Icon character"
                  value={project.icon}
                  onChange={(value) => setProject(index, "icon", value)}
                />
                <label className="admin-field">
                  <span>Accent color</span>
                  <select
                    value={project.color}
                    onChange={(event) =>
                      setProject(index, "color", event.target.value)
                    }
                  >
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="gray">Gray</option>
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section window" id="skills-editor">
        <div className="admin-section-title">
          <span>04</span>
          <div>
            <h2>Skills</h2>
            <p>
              One skill per line. The public page updates its item count
              automatically.
            </p>
          </div>
        </div>
        <Field
          label="Skills"
          value={data.skills.join("\n")}
          onChange={(value) =>
            setData((current) => ({
              ...current,
              skills: value
                .split("\n")
                .map((skill) => skill.trim())
                .filter(Boolean),
            }))
          }
          multiline
        />
      </section>

      <section className="admin-section window" id="education-editor">
        <div className="admin-section-title">
          <span>05</span>
          <div>
            <h2>Education</h2>
            <p>Degree and institution details.</p>
          </div>
        </div>
        <div className="admin-fields-grid">
          <Field
            label="School"
            value={data.education.school}
            onChange={(value) =>
              setData((current) => ({
                ...current,
                education: { ...current.education, school: value },
              }))
            }
          />
          <Field
            label="Degree"
            value={data.education.degree}
            onChange={(value) =>
              setData((current) => ({
                ...current,
                education: { ...current.education, degree: value },
              }))
            }
          />
          <Field
            label="Program"
            value={data.education.program}
            onChange={(value) =>
              setData((current) => ({
                ...current,
                education: { ...current.education, program: value },
              }))
            }
          />
          <Field
            label="Dates"
            value={data.education.dates}
            onChange={(value) =>
              setData((current) => ({
                ...current,
                education: { ...current.education, dates: value },
              }))
            }
          />
        </div>
      </section>
      <div className="editor-bottom-save">
        <button className="retro-button primary-button" disabled={busy}>
          {busy ? "Publishing…" : "Save & publish ↗"}
        </button>
      </div>
    </form>
  );
}
