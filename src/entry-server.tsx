import { App } from "./app";
import { results } from "./lib/hooks/server";
import renderToString from "preact-render-to-string";
import { ServerRenderer } from "vite-plugin-ssr-ssg";

function renderState(state: any) {
  return /*html*/`<script>window.__STATE_SSR__=${JSON.stringify(state)};</script>`;
}

const render: ServerRenderer = async (url, manifest) => {
  if (url.startsWith("/api")) {
    return { bodyTags: "OK" };
  }
  const result = await renderToString(<App url={url} />);

  // // execute the server side code
  // const promises = Object.values(callbacks).map((cb) => {
  //   // if callback returns a promise
  //   const result = cb();
  //   if (result instanceof Promise) {
  //     return result;
  //   }
  //   return new Promise((resolve) => resolve(result));
  // });
  // const results = await Promise.all(promises);
  // const keys = Object.keys(callbacks);
  // const state = Object.fromEntries(
  //   keys.map((key, i) => [key, results[i]])
  // );

  const bodyTags = result + renderState(results);
  return { bodyTags };
};

export default render;
