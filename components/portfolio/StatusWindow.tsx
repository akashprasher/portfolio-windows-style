"use client";

import type { PortfolioData } from "@/lib/data/portfolio";
import { EasterEggFault, useEasterEgg } from "./EasterEgg";
import { WindowBar } from "./Window";

export function StatusWindow({
  profile,
  skills,
}: {
  profile: PortfolioData["profile"];
  skills: string[];
}) {
  const { displayGlitch } = useEasterEgg();
  const preferredSkills = ["React", "Next.js", "TypeScript", "Node.js", "FastAPI"];
  const featuredSkills = preferredSkills.filter((skill) =>
    skills.some((item) => item.toLowerCase() === skill.toLowerCase()),
  );
  const stack = (featuredSkills.length > 0 ? featuredSkills : skills)
    .slice(0, 4)
    .join(" · ");

  return (
    <aside
      className={`window status-window${displayGlitch ? " is-desynced" : ""}`}
    >
      <WindowBar title="profile.sys" />
      <div className="status-content">
        <EasterEggFault />
        <section
          className={`video-monitor${displayGlitch ? " is-faulted" : ""}`}
          aria-label="Engineering profile display"
        >
          {displayGlitch && (
            <span className="display-tear" aria-hidden="true" />
          )}
          <div className="video-monitor-header">
            <span>ENGINEER PROFILE</span>
            <strong>{displayGlitch ? "DISPLAY FAULT" : "PROFILE LOADED"}</strong>
          </div>
          <div className="video-monitor-readout">
            <div>
              <span>NAME</span>
              <strong>{profile.name}</strong>
            </div>
            <div>
              <span>FOCUS</span>
              <strong>PRODUCT ENGINEERING</strong>
            </div>
            <div>
              <span>STACK</span>
              <strong>{stack || "Full-stack engineering"}</strong>
            </div>
          </div>
          <div className="video-color-bars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="video-monitor-footer">
            <span>PROFILE.SYS v1</span>
            <span>{displayGlitch ? "BUFFER ERROR" : "SYSTEM ONLINE"}</span>
          </div>
        </section>
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
  );
}
