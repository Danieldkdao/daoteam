"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

type UnauthorizedStateProps = {
  title?: string;
  description?: string;
};

export const UnauthorizedState = ({
  title = "You do not have access to this page",
  description = "This area is only available to workspace admins and owners.",
}: UnauthorizedStateProps) => {
  const [backHref, setBackHref] = useState("/workspace");

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const workspacePath = currentUrl.pathname.match(/^\/workspace\/[^/]+/);

    setBackHref(workspacePath?.[0] ?? "/workspace");
  }, []);

  return (
    <div className="w-full rounded-lg border bg-card p-8 shadow-sm">
      <div className="space-y-3">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Unauthorized
        </span>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <Button asChild className="mt-2">
          <Link href={backHref}>Back to Workspace</Link>
        </Button>
      </div>
    </div>
  );
};
