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
    <div className="flex flex-col gap-2 w-50">
      {links.map((l) => {
        const href = `/workspace/${workspaceId}/settings${l.href}`;
        const isActive = pathname === href;
        return (
          <Link
            key={l.href}
            href={href}
            className={cn(
              "text-lg font-medium py-2 px-4 rounded-md w-full text-left",
              isActive ? "bg-primary/40" : "hover:bg-card/40",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
};
