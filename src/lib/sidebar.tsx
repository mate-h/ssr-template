import { classes } from "./classes";
import { useLocation } from "./hooks/location";
import { Icon, IconName } from "./icon";

type Props = {
  class?: string;
  items?: Array<{
    name: string;
    icon: IconName;
    href: string;
  }>;
};

export function Sidebar(props: Props) {
  const { class: c, items = [] } = props;
  const [location] = useLocation();
  return (
    <nav class={c}>
      <div class="space-y-1">
        {items.map((item) => {
          const current = location === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              class={classes(
                current
                  ? "bg-label-background-divider text-label-surface"
                  : "text-label-surface-medium hover:text-label-surface hover:bg-label-surface-divider",
                "group flex items-center px-2 py-2 text-base sm:text-sm font-medium rounded-md"
              )}
              aria-current={current ? "page" : undefined}
            >
              <Icon
                name={item.icon}
                class={classes(
                  current
                    ? "text-label-surface-medium"
                    : "text-label-surface-disabled group-hover:text-label-surface-medium",
                  "mr-3 flex-shrink-0 w-6 flex justify-center"
                )}
              />
              {item.name}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
