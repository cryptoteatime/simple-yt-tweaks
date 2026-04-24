import { DEFAULT_SETTINGS, type Settings } from './settings';

export type FullscreenActionDockState = {
  target: HTMLElement;
  originalParent: Node;
  originalNextSibling: ChildNode | null;
  shell: HTMLElement;
};

export type ContentState = {
  settings: Settings;
  currentUrl: string;
  observer: MutationObserver | null;
  watchObserver: MutationObserver | null;
  watchObservedTarget: Element | null;
  fullscreenActionObserver: MutationObserver | null;
  fullscreenActionObservedTarget: Element | null;
  domRerun: (() => void) | null;
  fullscreenActionDock: FullscreenActionDockState | null;
  storageObserverBound: boolean;
  pointerHandlersBound: boolean;
  lastPointerX: number;
  lastPointerY: number;
  lastEnhancedTheaterActive: boolean;
  modeTransitionTimers: number[];
};

export const state: ContentState = {
  settings: { ...DEFAULT_SETTINGS },
  currentUrl: location.href,
  observer: null,
  watchObserver: null,
  watchObservedTarget: null,
  fullscreenActionObserver: null,
  fullscreenActionObservedTarget: null,
  domRerun: null,
  fullscreenActionDock: null,
  storageObserverBound: false,
  pointerHandlersBound: false,
  lastPointerX: Number.POSITIVE_INFINITY,
  lastPointerY: Number.POSITIVE_INFINITY,
  lastEnhancedTheaterActive: false,
  modeTransitionTimers: [],
};
