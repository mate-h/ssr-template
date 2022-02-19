import { StoreonModule } from "storeon";

type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export type State = {
  contacts: Record<string, Contact>;
};

export type Events = {
  "contacts.set": Record<string, Contact>;
};

export const module: StoreonModule<State, Events> = (store) => {
  store.on("@init", ({ contacts }) => ({
    contacts: contacts || {},
  }));

  store.on("contacts.set", (_, contacts) => ({ contacts }));
};
