"use client";

import Link from "next/link";
import { Button } from "../ui/button";
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
    <div className="flex flex-col gap-1 w-50">
      {links.map((l) => {
        const href = `/workspace/${workspaceId}/settings${l.href}`;
        const isActive = pathname === href;
        return (
          <Link key={l.href} href={href}>
            <Button
              variant="ghost"
              className={cn(
                "text-left flex justify-start w-full",
                isActive && "bg-primary/40",
              )}
            >
              {l.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
