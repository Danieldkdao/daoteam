"use client";

import Link from "next/link";
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type BillingErrorStateProps = {
  workspaceId: string;
  title: string;
  description: string;
};

export const BillingErrorState = ({
  workspaceId,
  title,
  description,
}: BillingErrorStateProps) => {
  return (
    <div className="w-full rounded-lg border border-dashed border-destructive/35 bg-destructive/8 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-destructive/12 text-destructive">
          <AlertCircleIcon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-destructive">{title}</h2>
          <p className="mt-1 text-sm text-destructive/80">{description}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => window.location.reload()}>
              <RefreshCwIcon />
              Try Again
            </Button>
            <Link href={`/workspace/${workspaceId}`}>
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Workspace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
