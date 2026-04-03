"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  {
    label: "Billing",
    href: "/billing",
  },
  {
    label: "Usage",
    href: "/usage",
  },
];

export const SettingsLinks = ({ workspaceId }: { workspaceId: string }) => {
  const pathname = usePathname();

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-full items-end gap-2 border-b">
        {links.map((l) => {
          const href = `/workspace/${workspaceId}/settings${l.href}`;
          const isActive = pathname === href;

          return (
            <Link
              key={l.href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex-1 rounded-t-xl border-b-2 px-4 py-3 text-center text-sm font-semibold whitespace-nowrap transition-colors md:flex-none md:px-5 md:text-base",
                isActive
                  ? "border-primary bg-card text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
