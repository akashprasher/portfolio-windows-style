"use client";

import { useWindowDrag, useWindowManager } from "./WindowManager";

export function WindowBar({ title }: { title: string }) {
  const { setWindowState, states } = useWindowManager();
  const { barRef, onPointerDown, onPointerMove, onPointerUp, focus } =
    useWindowDrag(title);
  const maximized = states[title] === "maximized";

  return (
    <div
      className="window-bar"
      ref={barRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={focus}
    >
      <div className="window-title">
        <span className="window-file-icon" aria-hidden="true">
          ▧
        </span>
        <span>{title}</span>
      </div>
      <div className="window-controls">
        <button
          type="button"
          aria-label={`Minimize ${title}`}
          title="Minimize"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setWindowState(title, "minimized");
          }}
        >
          −
        </button>
        <button
          type="button"
          aria-label={`${maximized ? "Restore" : "Maximize"} ${title}`}
          title={maximized ? "Restore" : "Maximize"}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setWindowState(title, maximized ? null : "maximized");
          }}
        >
          {maximized ? "❐" : "□"}
        </button>
        <button
          type="button"
          aria-label={`Close ${title}`}
          title="Close"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setWindowState(title, "closed");
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id: string;
}) {
  return (
    <div className="section-heading" id={id}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}
