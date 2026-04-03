"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getColorCombination } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const WorkspaceListView = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <Suspense fallback={<WorkspaceListLoading mobile={mobile} />}>
      <ErrorBoundary fallback={<WorkspaceListError mobile={mobile} />}>
        <WorkspaceListSuspense mobile={mobile} />
      </ErrorBoundary>
    </Suspense>
  );
};

const WorkspaceListLoading = ({ mobile = false }: { mobile?: boolean }) => {
  if (mobile) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="size-16 shrink-0 rounded-xl" />
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full overflow-auto">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
};

const WorkspaceListError = ({ mobile = false }: { mobile?: boolean }) => {
  if (mobile) {
    return (
      <div className="shrink-0 rounded-lg border border-dashed border-destructive/35 bg-destructive/8 px-3 py-2">
        <p className="text-sm font-semibold text-destructive">
          Unable to load workspaces
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-destructive/35 bg-destructive/8 p-3">
      <h2 className="text-sm font-semibold text-destructive">
        Unable to load workspaces
      </h2>
      <p className="mt-1 text-xs leading-5 text-destructive/80">
        Something went wrong while loading your workspaces. Please refresh and
        try again.
      </p>
    </div>
  );
};

const WorkspaceListSuspense = ({ mobile = false }: { mobile?: boolean }) => {
  const trpc = useTRPC();
  const { data: workspaces } = useSuspenseQuery(
    trpc.workspace.getMany.queryOptions(),
  );

  return (
    <div
      className={cn(
        mobile
          ? "flex items-center gap-3 overflow-x-auto"
          : "flex flex-col gap-3 w-full overflow-auto",
      )}
    >
      {workspaces.map((w) => (
        <Link
          key={w.id}
          href={`/workspace/${w.id}`}
          className={cn(mobile ? "shrink-0" : "w-full")}
        >
          <Tooltip>
            <TooltipTrigger className="w-full cursor-pointer" asChild>
              <div
                className={cn(
                  mobile
                    ? "size-16 rounded-xl flex items-center justify-center transition-colors duration-150"
                    : "rounded-xl w-full h-20 flex items-center justify-center transition-colors duration-150",
                  getColorCombination(w.id),
                )}
              >
                <span className={cn(mobile ? "text-2xl font-bold" : "text-3xl font-bold")}>
                  {w.name[0].toUpperCase()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent align="center" side={mobile ? "bottom" : "right"}>
              {w.name}
            </TooltipContent>
          </Tooltip>
        </Link>
      ))}
    </div>
  );
};
