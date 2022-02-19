import { StoreonModule } from "storeon";

type Todo = {
  id: string;
  name: string;
  done: boolean;
};

export type State = {
  todos: Record<string, Todo>;
};

export type Events = {
  "todos.set": Record<string, Todo>;
};

export const module: StoreonModule<State, Events> = (store) => {
  store.on("@init", ({ todos }) => ({
    todos: todos || {},
  }));

  store.on("todos.set", (_, todos) => ({ todos }));
};
