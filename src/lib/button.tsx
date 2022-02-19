import { ComponentChildren } from "preact";
import { classes } from "./classes";

type Props = {
  children?: ComponentChildren;
} & JSX.IntrinsicElements["button"];

export function Button(props: Props) {
  const { children, class: c, ...rest } = props;
  return (
    <button
      class={classes(c, "!rounded-lg focus:outline-none")}
      bg="blue-600 hover:blue-800"
      text="sm white"
      font="mono light"
      p="y-2 x-4"
      ring="0 focus:2 rounded blue-200"
      {...rest}
    >
      {children}
    </button>
  );
}
