"use client";

import { SearchIcon, TriangleAlertIcon, UsersIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { MemberItem } from "./member-item";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export const ShowMembersButton = ({
  workspaceId,
  compact = false,
}: {
  workspaceId: string;
  compact?: boolean;
}) => {
  const trpc = useTRPC();
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebouncedValue(search, { wait: 1250 });
  const { data, isPending, isError, refetch, isRefetching } = useQuery(
    trpc.workspace.getMembers.queryOptions({
      workspaceId,
      search: debouncedSearchValue[0],
    }),
  );

  const members = data?.members ?? [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label="Show members"
          className={cn(compact && "size-9 px-0")}
        >
          <UsersIcon />
          {!compact ? "Members" : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="space-y-2 min-w-80">
        <PopoverHeader>
          <PopoverTitle>Workspace Members</PopoverTitle>
          <PopoverDescription>Members</PopoverDescription>
        </PopoverHeader>
        <Separator />
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center pl-2">
            <SearchIcon className="size-4" />
          </div>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name or email..."
            className="pl-8"
          />
        </div>
        <div className="max-h-90 min-h-24 overflow-y-auto">
          {isPending ? (
            <MembersPopoverLoading />
          ) : isError ? (
            <MembersPopoverError retry={refetch} retrying={isRefetching} />
          ) : members.length ? (
            <div className="space-y-1">
              {members.map((m) => (
                <MemberItem key={m.id} member={m} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-card p-4 text-center">
              <h2 className="font-semibold">No members found</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different name or email search.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const MembersPopoverLoading = () => {
  return (
    <div className="space-y-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start justify-between rounded-md p-2"
        >
          <div className="flex min-w-0 flex-1 gap-2">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-4 w-44 max-w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
};

const MembersPopoverError = ({
  retry,
  retrying,
}: {
  retry: () => Promise<unknown>;
  retrying: boolean;
}) => {
  return (
    <div className="rounded-lg border border-dashed border-destructive/35 bg-destructive/8 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-destructive/12 p-2">
          <TriangleAlertIcon className="size-4 text-destructive" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-destructive">
            Unable to load members
          </h2>
          <p className="mt-1 text-sm text-destructive/80">
            Something went wrong while loading this workspace&apos;s members.
            Please try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            disabled={retrying}
            onClick={() => void retry()}
          >
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
};
