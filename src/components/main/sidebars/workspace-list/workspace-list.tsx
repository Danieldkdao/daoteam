"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getColorCombination } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const WorkspaceListView = () => {
  return (
    <Suspense fallback={<WorkspaceListLoading />}>
      <ErrorBoundary fallback={<WorkspaceListError />}>
        <WorkspaceListSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const WorkspaceListLoading = () => {
  return <div>loading</div>;
};

const WorkspaceListError = () => {
  return <div>error</div>;
};

const WorkspaceListSuspense = () => {
  const trpc = useTRPC();
  const { data: workspaces } = useSuspenseQuery(
    trpc.workspace.getMany.queryOptions(),
  );

  return (
    <div className="flex flex-col gap-2 w-full overflow-auto">
      {workspaces.map((w) => (
        <Link key={w.id} href={`/workspace/${w.id}`} className="w-full">
          <Tooltip>
            <TooltipTrigger className="w-full cursor-pointer" asChild>
              <div
                className={cn(
                  "rounded-xl w-full h-20 flex items-center justify-center transition-colors duration-150",
                  getColorCombination(w.id),
                )}
              >
                <span className="text-3xl font-bold">
                  {w.name[0].toUpperCase()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent align="center" side="right">
              {w.name}
            </TooltipContent>
          </Tooltip>
        </Link>
      ))}
    </div>
  );
};
