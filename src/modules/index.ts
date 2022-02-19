import type { State as S1, Events as E1 } from "./todos/store";
import type { State as S2, Events as E2 } from "./contacts/store";

export type State = S1 & S2;
export type Events = E1 & E2;