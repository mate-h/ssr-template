import { FunctionComponent } from "preact";
import { getRoutes } from "vite-plugin-ssr-ssg";
import { Sidebar } from "./lib/sidebar";
import { Router, Route } from "wouter-preact";
//@ts-ignore
import staticLocationHook from "wouter-preact/static-location";
import { LocationContext } from "./lib/hooks/location";
import { StoreContext } from "storeon/preact";
import { Store, createStore } from "./stores";

const pages = import.meta.globEager("./pages/**/*.tsx");
const routes = getRoutes<"preact">(pages);

const WindowState = ({ store }: { store: Store }) => {
  const state = store.get();
  if (import.meta.env.SSR) {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__STATE__ = ${JSON.stringify(state)};`,
        }}
      />
    );
  }
  return null;
};

export const App: FunctionComponent<{ url?: string }> = ({ url }) => {
  // console.log(routes);
  const locationHook = import.meta.env.SSR
    ? staticLocationHook(url)
    : undefined;
  const store = createStore({
    location: url,
  });
  return (
    <StoreContext.Provider value={store}>
      <Sidebar
        items={[
          { name: "Home", icon: "house", href: "/" },
          { name: "About", icon: "info", href: "/about" },
        ]}
      />

      <Router hook={locationHook}>
        {routes.map(({ path, name, Component }) => (
          <Route path={path} key={name}>
            <Component />
          </Route>
        ))}
      </Router>
      <WindowState store={store} />
    </StoreContext.Provider>
  );
};
