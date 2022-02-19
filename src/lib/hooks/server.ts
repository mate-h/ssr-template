import { createContext } from "preact";
import { useStore } from "@/stores";
import sp from "synchronized-promise";

export const ServerContext = createContext({});

export let callbacks: Record<string, () => Promise<any>> = {};
export let results: Record<string, any> = {};

function getHash(input: string) {
  var hash = 0,
    len = input.length;
  for (var i = 0; i < len; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // to 32bit integer
  }
  return hash.toString();
}

// this is an isomorphic hook that allows the user to
// run server side code and then read the state on both the client and server
export function useServer<T = any>(cb: () => Promise<T>, id?: string) {
  const isServer = import.meta.env.SSR;

  const fnid: string = id || getHash(cb.toString());
  if (isServer) {
    callbacks[fnid] = cb;
    const s = sp(cb as any);
    const result = s();
    if (result) {
      results[fnid] = result;
    }
    
    return result;
  } else {
    const s = (window as any).__STATE_SSR__;
    if (s) {
      return s[fnid];
    }
  }
}
