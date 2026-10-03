"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const DISPLAY_STATE_KEY = "portfolio-display-glitch-state";
const REPAIRED_STORAGE_KEY = "portfolio-display-repaired";
const MAX_GLITCH_APPEARANCES = 5;
const MOBILE_BREAKPOINT = "(max-width: 680px)";

type SavedDisplayState = {
  triggered: boolean;
  appearances: number;
  resolved: boolean;
};

const INITIAL_DISPLAY_STATE: SavedDisplayState = {
  triggered: false,
  appearances: 0,
  resolved: false,
};

type EasterEggContextValue = {
  displayGlitch: boolean;
  openTerminal: () => void;
};

const EasterEggContext = createContext<EasterEggContextValue | null>(null);

export function EasterEggProvider({
  children,
  name,
  intro,
  bio,
  secondBio,
  skills,
  resumeAvailable,
}: {
  children: ReactNode;
  name: string;
  intro: string;
  bio: string;
  secondBio: string;
  skills: string[];
  resumeAvailable: boolean;
}) {
  const [displayGlitch, setDisplayGlitch] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [repaired, setRepaired] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_BREAKPOINT).matches,
  );
  const displayState = useRef<SavedDisplayState>(INITIAL_DISPLAY_STATE);
  const appearanceCounted = useRef(false);
  const remainingDelay = useRef(5_000);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const updateViewport = (event: MediaQueryListEvent) =>
      setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!displayGlitch || isMobile) return;

    const audio = new Audio("/audio/error.mp3");
    audio.preload = "auto";
    audio.volume = 0.45;
    void audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        return;
      }
      console.warn("Could not play the display error sound.", error);
    });
    return () => {
      audio.pause();
    };
  }, [displayGlitch, isMobile]);

  const saveDisplayState = useCallback((state: SavedDisplayState) => {
    displayState.current = state;
    try {
      window.localStorage.setItem(DISPLAY_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Could not save the display glitch state.", error);
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setDisplayGlitch(false);
      setTerminalOpen(false);
      return;
    }

    let savedState = INITIAL_DISPLAY_STATE;
    try {
      const stored = window.localStorage.getItem(DISPLAY_STATE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "triggered" in parsed &&
          typeof parsed.triggered === "boolean" &&
          "appearances" in parsed &&
          typeof parsed.appearances === "number" &&
          Number.isInteger(parsed.appearances) &&
          parsed.appearances >= 0 &&
          "resolved" in parsed &&
          typeof parsed.resolved === "boolean"
        ) {
          savedState = {
            triggered: parsed.triggered,
            appearances: parsed.appearances,
            resolved: parsed.resolved,
          };
        }
      }

      if (window.localStorage.getItem(REPAIRED_STORAGE_KEY) === "true") {
        displayState.current = {
          triggered: true,
          appearances: MAX_GLITCH_APPEARANCES,
          resolved: true,
        };
        setRepaired(true);
        return;
      }
    } catch (error) {
      console.warn("Could not read the display glitch state.", error);
    }

    displayState.current = savedState;
    if (savedState.resolved) return;

    if (savedState.triggered) {
      if (savedState.appearances >= MAX_GLITCH_APPEARANCES) {
        saveDisplayState({ ...savedState, resolved: true });
        return;
      }
      if (!appearanceCounted.current) {
        saveDisplayState({
          ...savedState,
          appearances: savedState.appearances + 1,
        });
        appearanceCounted.current = true;
      }
      setDisplayGlitch(true);
      return;
    }

    let startedAt = 0;
    let timer: number | undefined;

    function startTimer() {
      if (document.visibilityState !== "visible" || timer !== undefined) return;
      startedAt = Date.now();
      timer = window.setTimeout(() => {
        timer = undefined;
        remainingDelay.current = 0;
        appearanceCounted.current = true;
        saveDisplayState({
          triggered: true,
          appearances: 1,
          resolved: false,
        });
        setDisplayGlitch(true);
      }, remainingDelay.current);
    }

    function pauseTimer() {
      if (timer === undefined) return;
      window.clearTimeout(timer);
      timer = undefined;
      remainingDelay.current = Math.max(
        0,
        remainingDelay.current - (Date.now() - startedAt),
      );
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") pauseTimer();
      else startTimer();
    }

    startTimer();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      pauseTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMobile, saveDisplayState]);

  const repairDisplay = useCallback(() => {
    setDisplayGlitch(false);
    setRepaired(true);
    saveDisplayState({
      ...displayState.current,
      triggered: true,
      resolved: true,
    });
    try {
      window.localStorage.setItem(REPAIRED_STORAGE_KEY, "true");
    } catch (error) {
      console.warn("Could not save the display repair preference.", error);
    }
  }, [saveDisplayState]);

  const openTerminal = useCallback(() => {
    if (!isMobile) setTerminalOpen(true);
  }, [isMobile]);

  return (
    <EasterEggContext.Provider value={{ displayGlitch, openTerminal }}>
      {children}
      {terminalOpen && (
        <RecoveryTerminal
          onClose={() => setTerminalOpen(false)}
          onRepair={repairDisplay}
          repaired={repaired}
          name={name}
          intro={intro}
          bio={bio}
          secondBio={secondBio}
          skills={skills}
          resumeAvailable={resumeAvailable}
        />
      )}
    </EasterEggContext.Provider>
  );
}

export function useEasterEgg() {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error("Easter egg components must be used inside EasterEggProvider.");
  }
  return context;
}

export function EasterEggFault() {
  const { displayGlitch, openTerminal } = useEasterEgg();
  const [showClue, setShowClue] = useState(false);

  useEffect(() => {
    if (!displayGlitch) {
      setShowClue(false);
      return;
    }

    const timer = window.setTimeout(() => setShowClue(true), 3_000);
    return () => window.clearTimeout(timer);
  }, [displayGlitch]);

  if (!displayGlitch) return null;

  return (
    <div className="display-fault" role="status" aria-live="polite">
      <span>DISPLAY BUFFER DESYNC</span>
      <button type="button" onClick={openTerminal}>
        OPEN TERMINAL <span aria-hidden="true">↗</span>
      </button>
      {showClue && (
        <p className="display-fault-clue">
          TRIVIA: DOS used <code>MODE CO80</code> to restore 80-column color
          display.
        </p>
      )}
    </div>
  );
}

function RecoveryTerminal({
  onClose,
  onRepair,
  repaired,
  name,
  intro,
  bio,
  secondBio,
  skills,
  resumeAvailable,
}: {
  onClose: () => void;
  onRepair: () => void;
  repaired: boolean;
  name: string;
  intro: string;
  bio: string;
  secondBio: string;
  skills: string[];
  resumeAvailable: boolean;
}) {
  type TerminalLine = {
    prompt?: string;
    text: string;
    href?: string;
    success?: boolean;
  };

  const virtualFiles: Record<string, string> = {
    "C:\\README.TXT": [
      "AKASH.OS RECOVERY DISK",
      "",
      "Commands: DIR /A, CD, TYPE, CAT, TREE, HELP",
      "Try: CD SYSTEM, then TYPE VIDEO.TXT",
      "Hidden files are marked with an asterisk.",
      "A working display mode is MODE CO80.",
    ].join("\n"),
    "C:\\ABOUT.TXT": `${name}\n\n${intro}\n\n${bio}\n\n${secondBio}`,
    "C:\\SKILLS.TXT": skills.join("  ·  "),
    "C:\\HOBBIES.TXT": [
      "PERSONAL INTERESTS",
      "",
      "No off-the-clock hobbies are listed in this profile yet.",
      "Known interests: product thinking, engineering craft,",
      "clear architecture, and thoughtful interfaces.",
      "",
      `Ask ${name} what they enjoy away from the keyboard.`,
    ].join("\n"),
    "C:\\RESUME.TXT": resumeAvailable
      ? `Resume link: /resume\nUse OPEN RESUME to visit it.`
      : "No public resume link has been added yet.",
    "C:\\SYSTEM\\VIDEO.TXT": [
      "VIDEO ADAPTER DIAGNOSTICS",
      "ERROR: DISPLAY BUFFER DESYNC",
      "MODE 03h / 80x25 TEXT",
      "H-SYNC LOST",
      "",
      "Suggested recovery: MODE CO80",
    ].join("\n"),
    "C:\\SYSTEM\\RECOVERY.TXT": [
      "RECOVERY NOTES",
      "",
      "MODE CO80 restores 80-column color text mode.",
      "DIR /A lists hidden files.",
      "TYPE EASTER.EGG to inspect the hidden note.",
    ].join("\n"),
    "C:\\SYSTEM\\EASTER.EGG": [
      "You found the hidden file.",
      "",
      "Good debugging is mostly curiosity,",
      "a careful look, and one more command.",
      "",
      "P.S. You can drag this terminal by its title bar.",
    ].join("\n"),
  };
  const directories = ["C:\\", "C:\\SYSTEM"];
  const [command, setCommand] = useState("");
  const [cwd, setCwd] = useState("C:\\");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [output, setOutput] = useState<TerminalLine[]>([
    { text: "DISPLAY BUFFER DESYNC. TYPE HELP FOR COMMANDS." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLElement>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    baseLeft: number;
    baseTop: number;
  } | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const appendLines = useCallback((lines: TerminalLine[]) => {
    setOutput((current) => [...current, ...lines].slice(-120));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const element = titleBarRef.current?.parentElement;
    if (!element) return;
    setPosition({
      x: Math.max(16, (window.innerWidth - element.offsetWidth) / 2),
      y: Math.max(16, (window.innerHeight - element.offsetHeight) / 2),
    });
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  function resolvePath(target: string, base = cwd) {
    const normalizedTarget = target.replaceAll("/", "\\");
    const parts =
      normalizedTarget.startsWith("C:") || normalizedTarget.startsWith("\\")
      ? []
      : base.slice(3).split("\\").filter(Boolean);

    for (const part of normalizedTarget.replace(/^C:\\?/, "").split("\\")) {
      if (!part || part === ".") continue;
      if (part === "..") parts.pop();
      else parts.push(part.toUpperCase());
    }

    return `C:\\${parts.join("\\")}`;
  }

  function handleTitlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    const element = titleBarRef.current?.parentElement;
    if (!element) return;
    event.preventDefault();
    const rect = element.getBoundingClientRect();
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseLeft: rect.left,
      baseTop: rect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleTitlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    const activeDrag = drag.current;
    const element = titleBarRef.current?.parentElement;
    if (
      !activeDrag ||
      activeDrag.pointerId !== event.pointerId ||
      !element
    ) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const left = Math.min(
      Math.max(16, window.innerWidth - rect.width - 16),
      Math.max(16, activeDrag.baseLeft + event.clientX - activeDrag.startX),
    );
    const top = Math.min(
      Math.max(16, window.innerHeight - rect.height - 16),
      Math.max(16, activeDrag.baseTop + event.clientY - activeDrag.startY),
    );
    setPosition({ x: left, y: top });
  }

  function handleTitlePointerUp(event: ReactPointerEvent<HTMLElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function runCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entered = command.trim();
    if (!entered) return;

    const [rawCommand, ...args] = entered.split(/\s+/);
    const action = rawCommand.toLowerCase();
    setCommand("");
    setHistory((current) => [...current, entered].slice(-30));
    setHistoryIndex(history.length + 1);
    appendLines([{ prompt: `${cwd}>`, text: entered }]);

    if (action === "help") {
      appendLines([
        {
          text: [
            "DIR / LS [PATH]   list files; add /A or -a for hidden files",
            "CD [PATH]         change directory     PWD   show current path",
            "TYPE / CAT FILE   print a file          TREE  show directories",
            "OPEN RESUME       open published resume",
            "MODE CO80         repair the display    CLEAR / CLS   clear screen",
            "WHOAMI / VER      session and system info",
            "ECHO TEXT         print a line          EXIT  close terminal",
          ].join("\n"),
        },
      ]);
      return;
    }

    if (action === "clear" || action === "cls") {
      setOutput([]);
      return;
    }

    if (action === "pwd") {
      appendLines([{ text: cwd }]);
      return;
    }

    if (action === "whoami") {
      appendLines([{ text: `${name} — guest session` }]);
      return;
    }

    if (action === "ver") {
      appendLines([{ text: "Akash.OS [Version 4.10.1998] · simulated DOS environment" }]);
      return;
    }

    if (action === "echo") {
      appendLines([{ text: args.join(" ") }]);
      return;
    }

    if (action === "exit") {
      onClose();
      return;
    }

    if (action === "cd") {
      const nextPath = resolvePath(args[0] ?? "C:\\");
      if (!directories.includes(nextPath)) {
        appendLines([{ text: `The system cannot find the path specified: ${args[0] ?? ""}` }]);
      } else {
        setCwd(nextPath);
      }
      return;
    }

    if (action === "dir" || action === "ls") {
      const showHidden = args.some((arg) => arg === "/a" || arg === "-a");
      const targetArg = args.find(
        (arg) => !arg.startsWith("-") && !/^\/a$/i.test(arg),
      );
      const target = resolvePath(targetArg ?? ".");
      if (!directories.includes(target)) {
        appendLines([{ text: `Directory not found: ${target}` }]);
        return;
      }

      const prefix = target === "C:\\" ? "C:\\" : `${target}\\`;
      const childDirectories = directories
        .filter((directory) => {
          if (directory === target || !directory.startsWith(prefix)) return false;
          return !directory.slice(prefix.length).includes("\\");
        })
        .map((directory) => `${directory.slice(prefix.length)}\\ <DIR>`);
      const childFiles = Object.keys(virtualFiles)
        .filter((path) => {
          if (!path.startsWith(prefix)) return false;
          const name = path.slice(prefix.length);
          if (name.includes("\\")) return false;
          return !name.endsWith(".EGG");
        })
        .map((path) => path.slice(prefix.length));
      if (showHidden && target === "C:\\SYSTEM") childFiles.push("EASTER.EGG *");
      appendLines([
        {
          text: `${target}\n\n${[...childDirectories, ...childFiles].join("\n") || "No files found."}`,
        },
      ]);
      return;
    }

    if (action === "tree") {
      appendLines([
        {
          text: "C:\\\n├── README.TXT\n├── ABOUT.TXT\n├── HOBBIES.TXT\n├── RESUME.TXT\n├── SKILLS.TXT\n└── SYSTEM\n    ├── VIDEO.TXT\n    ├── RECOVERY.TXT\n    └── EASTER.EGG (hidden)",
        },
      ]);
      return;
    }

    if (action === "cat" || action === "type") {
      if (!args[0]) {
        appendLines([{ text: "Usage: TYPE <filename>" }]);
        return;
      }
      const filePath = resolvePath(args[0]);
      const content = virtualFiles[filePath];
      appendLines([
        {
          text: content ?? `File not found: ${args[0]}`,
        },
      ]);
      return;
    }

    if (action === "open" && args[0]?.toLowerCase() === "resume") {
      if (resumeAvailable) {
        appendLines([
          { text: "Resume is ready:" },
          { text: "Open published resume ↗", href: "/resume" },
        ]);
      } else {
        appendLines([{ text: "No public resume is available yet. Try TYPE RESUME.TXT." }]);
      }
      return;
    }

    if (action === "mode" && args.join(" ").toUpperCase() === "CO80") {
      appendLines([
        { text: "Display mode reset. Video buffer synchronized.", success: true },
      ]);
      onRepair();
      return;
    }

    appendLines([{ text: `Bad command or file name: ${rawCommand}. Type HELP.` }]);
  }

  return (
    <section
      className="recovery-terminal"
      aria-label="System recovery terminal"
      style={{
        left: position?.x ?? "50%",
        top: position?.y ?? "50%",
        transform: position ? "none" : "translate(-50%, -50%)",
      }}
    >
      <header
        className="recovery-terminal-bar"
        ref={titleBarRef}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onPointerCancel={handleTitlePointerUp}
      >
        <span>
          <span aria-hidden="true">▧</span> C:\WINDOWS\COMMAND.COM
          <small>DRAG TO MOVE</small>
        </span>
        <button type="button" aria-label="Close terminal" onClick={onClose}>
          ×
        </button>
      </header>
      <div className="recovery-terminal-screen" ref={outputRef} aria-live="polite">
        {output.map((line, index) => (
          <div
            className={line.success ? "recovery-terminal-success" : undefined}
            key={`${index}-${line.text}`}
          >
            {line.prompt && <span>{line.prompt} </span>}
            {line.href ? (
              <a href={line.href} target="_blank" rel="noreferrer">
                {line.text}
              </a>
            ) : (
              line.text.split("\n").map((part, partIndex) => (
                <span key={`${index}-${partIndex}`}>
                  {partIndex > 0 && <br />}
                  {part}
                </span>
              ))
            )}
          </div>
        ))}
        <form onSubmit={runCommand}>
          <label htmlFor="recovery-command">{cwd}&gt;</label>
          <input
            autoComplete="off"
            id="recovery-command"
            ref={inputRef}
            spellCheck={false}
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowUp") {
                event.preventDefault();
                const index = Math.max(0, historyIndex - 1);
                setHistoryIndex(index);
                setCommand(history[index] ?? "");
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                const index = Math.min(history.length, historyIndex + 1);
                setHistoryIndex(index);
                setCommand(history[index] ?? "");
              }
            }}
            aria-label="Terminal command"
          />
        </form>
      </div>
      <footer className="recovery-terminal-footer">
        {repaired ? "DISPLAY RESTORED · SIMULATED FILESYSTEM" : "SIMULATED SYSTEM RECOVERY"}
      </footer>
    </section>
  );
}
