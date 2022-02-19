import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { useLocation as useLocationHook } from "wouter-preact";

export const LocationContext = createContext<{ url: string }>({ url: "/" });

/** Isomorphic use location hook */
export function useLocation() {
  if (!import.meta.env.SSR) {
    return useLocationHook();
  }
  const { url } = useContext(LocationContext);
  let location = url;
  let setLocation: ReturnType<typeof useLocationHook>[1] = () => {};
  return [location, setLocation];
}
