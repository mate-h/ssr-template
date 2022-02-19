import { hydrate } from "preact";
import { App } from "./app";
import "virtual:windi.css";

const state = (window as any).__STATE__;

hydrate(<App url={state.location} />, document.getElementById("app")!);
