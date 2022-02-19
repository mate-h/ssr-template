import { useEffect } from "preact/hooks";
import {
  createStoreon,
  StoreonEvents,
  StoreonModule,
  StoreonStore,
} from "storeon";
import { useStoreon } from "storeon/preact";
import { autosave } from "./lib/autosave";
import type { State as ModuleState, Events as ModuleEvents } from "./modules";
const modules = import.meta.globEager("./modules/**/store.ts");

type State = {
  location: string;
} & ModuleState;

type Events = {} & ModuleEvents;

export type StoreModule = StoreonModule<State, Events>;

export type Store = StoreonStore<State, Events>;

let store: Store;

export function createStore(init?: Partial<State>) {
  const initModule: StoreModule = (store) => {
    store.on("@init", () => init);
    store.on("@dispatch", (_, [event]) => {
      console.log(`[storeon] ${event}`);
    });
  };
  const m = Object.values(modules).map((m) => m.module);
  store = createStoreon([initModule, ...m, autosave(["todos"])]);

  if (!import.meta.env.SSR) {
    (window as any).store = store;
  }

  return store;
}

export type StateKeys = keyof State;

export function useStore(...keys: StateKeys[]) {
  return useStoreon<State, Events>(...keys);
}

export function useEvent<
  Event extends keyof (Events & StoreonEvents<State, Events>)
>(event: Event, handler: createStoreon.EventHandler<State, Events, Event>) {
  useEffect(() => {
    return store.on(event, handler);
  }, [event]);
}
