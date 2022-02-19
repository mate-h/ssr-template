import { StateKeys } from "@/stores";
import { merge, set } from "lodash";
import { StoreonModule, StoreonStore } from "storeon";

type Config = Record<
  StateKeys,
  {
    /** Reference to collection name */
    collection?: string;
    /** Whether to use realtime listener
     * @default false
     */
    realtime?: boolean;
  }
>;

type State = {};

type Events = {
  "@post": StateKeys;
  "@save": StateKeys;
};

// lodash flatten object recursively and join with dot
const flattenObject = (
  obj: Record<string, any>,
  prefix: string = ""
): Record<string, any> => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object") {
      return merge(acc, flattenObject(value, newPrefix));
    }
    return set(acc, newPrefix, value);
  }, {} as Record<string, any>);
};

const compareObjects = (obj1: any, obj2: any): boolean => {
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2;
  }
  const obj1Flat = flattenObject(obj1);
  const obj2Flat = flattenObject(obj2);
  return Object.keys(obj1Flat).every((key) => obj1Flat[key] === obj2Flat[key]);
};

type PersistProps = {
  store: StoreonStore<State, Events>;
  path: StateKeys;
  collection: string;
  added: Record<string, any>;
  changed: Record<string, any>;
  removed: string[];
};

async function persist({
  store,
  path,
  collection,
  added,
  changed,
  removed,
}: PersistProps) {
  await fetch(`/api/${collection}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      added,
      changed,
      removed,
    }),
  });
  store.dispatch("@save", path);
}

export function autosave(paths: StateKeys[], config?: Config) {
  let prevState: State;
  let module: StoreonModule<State, Events> = (store) => {
    store.on("@init", (initState) => {
      prevState = initState;
      store.on("@changed", async (state) => {
        paths.forEach((path) => {
          const currentCollection = (state as any)[path] as Record<string, any>;
          const prevCollection = (prevState as any)[path] as Record<
            string,
            any
          >;

          // compare collection items
          const added = Object.keys(currentCollection).filter(
            (key) => !prevCollection[key]
          );
          const removed = Object.keys(prevCollection).filter(
            (key) => !currentCollection[key]
          );
          const changed = Object.keys(currentCollection)
            .filter((key) => prevCollection[key] && currentCollection[key])
            .filter(
              (key) =>
                !compareObjects(currentCollection[key], prevCollection[key])
            );

          let collectionName: string = path;
          if (config && config[path] && config[path].collection) {
            collectionName = config[path].collection as string;
          }

          // console.log({ added, removed, changed });

          if (added.length + removed.length + changed.length > 0) {
            // data is stale on server
            store.dispatch("@post", path);
            persist({
              store,
              path,
              collection: collectionName,
              added: added.reduce((acc, key) => {
                return set(acc, key, currentCollection[key]);
              }, {}),
              changed: changed.reduce((acc, key) => {
                return set(acc, key, currentCollection[key]);
              }, {}),
              removed,
            });
          }
        });
        prevState = state;
      });
    });
  };
  return module;
}
