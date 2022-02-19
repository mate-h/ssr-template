import { createElement } from "preact";
import lookup from "./symbols";
import "./index.css";

export type IconName = keyof typeof lookup;

type Props = {
  name: IconName;
  style?: string;
  class?: string;
  tag?: string;
  [key: string]: any;
};
export function Icon({ tag = "i", name, class: c, style: s, ...rest }: Props) {
  return createElement(
    tag,
    {
      class: `icon ${name} ${c || ""}`,
      style: s,
      "aria-hidden": "true",
      ...rest,
    },
    lookup[name]
  );
}
