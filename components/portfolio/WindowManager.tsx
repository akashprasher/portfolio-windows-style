"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

type WindowState = "minimized" | "closed" | "maximized";

type WindowManagerValue = {
  states: Record<string, WindowState>;
  registerWindow: (id: string, element: HTMLElement) => void;
  setWindowState: (id: string, state: WindowState | null) => void;
  focusWindow: (id: string) => void;
};

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [states, setStates] = useState<Record<string, WindowState>>({});
  const statesRef = useRef(states);
  const windows = useRef(new Map<string, HTMLElement>());
  const nextZIndex = useRef(10);
  statesRef.current = states;

  const registerWindow = useCallback((id: string, element: HTMLElement) => {
    windows.current.set(id, element);
    element.dataset.windowId = id;
    const state = statesRef.current[id];
    if (state) element.dataset.windowState = state;
  }, []);

  const setWindowState = useCallback(
    (id: string, state: WindowState | null) => {
      const element = windows.current.get(id);
      if (element) {
        if (state) element.dataset.windowState = state;
        else delete element.dataset.windowState;
      }
      setStates((current) => {
        const next = { ...current };
        if (state) next[id] = state;
        else delete next[id];
        return next;
      });
    },
    [],
  );

  const focusWindow = useCallback((id: string) => {
    const element = windows.current.get(id);
    if (element) element.style.zIndex = String(nextZIndex.current++);
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{ states, registerWindow, setWindowState, focusWindow }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error("Window controls must be used inside WindowManagerProvider.");
  }
  return context;
}

export function WindowTaskbar() {
  const { states, setWindowState } = useWindowManager();
  const inactiveWindows = Object.entries(states).filter(
    ([, state]) => state === "minimized" || state === "closed",
  );

  if (inactiveWindows.length === 0) return null;

  return (
    <div className="window-taskbar" aria-label="Minimized and closed windows">
      {inactiveWindows.map(([id, state]) => (
        <button
          className="window-taskbar-button"
          key={id}
          type="button"
          onClick={() => setWindowState(id, null)}
          title={`Restore ${id}`}
        >
          <span aria-hidden="true">{state === "minimized" ? "▱" : "□"}</span>
          {id}
        </button>
      ))}
    </div>
  );
}

export function useWindowDrag(id: string) {
  const { registerWindow, focusWindow } = useWindowManager();
  const barRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    element: HTMLElement;
  } | null>(null);

  useEffect(() => {
    const element = barRef.current?.closest<HTMLElement>(".window");
    if (element) registerWindow(id, element);
  }, [id, registerWindow]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const element = barRef.current?.closest<HTMLElement>(".window");
    if (!element || (event.target as HTMLElement).closest("button")) return;

    event.preventDefault();
    focusWindow(id);
    const [offsetX = 0, offsetY = 0] = element.style.translate
      .split(" ")
      .map((value) => Number.parseFloat(value) || 0);
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX,
      offsetY,
      element,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const activeDrag = drag.current;
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) return;

    activeDrag.element.style.translate = `${
      activeDrag.offsetX + event.clientX - activeDrag.startX
    }px ${activeDrag.offsetY + event.clientY - activeDrag.startY}px`;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return {
    barRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    focus: () => focusWindow(id),
  };
}
