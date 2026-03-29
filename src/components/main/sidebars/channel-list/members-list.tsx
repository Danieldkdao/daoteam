"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon, UsersIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export const MembersListView = () => {
  const { workspaceId }: { workspaceId: string | undefined } = useParams();
  const trpc = useTRPC();
  const {
    data: memberData,
    isPending,
    isError,
  } = useQuery(trpc.workspace.getMembers.queryOptions({ workspaceId }));
  const [open, setOpen] = useState(true);

  const workspaceMembers = memberData?.members;
  const currentUserMember = memberData?.currentUserMember;

  if (isPending) return <MembersListLoading />;
  if (isError) return <MembersListError />;

  return (
    <div
      className={cn(
        "border-t flex h-70 flex-col overflow-hidden p-5 transition-[height] duration-200",
        open && "h-90",
      )}
    >
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="flex flex-1 flex-col min-h-0"
      >
        <CollapsibleTrigger className="w-full shrink-0">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-muted-foreground">Members</span>
            <ChevronDownIcon
              className={cn(
                "text-muted-foreground size-4 transition-discrete duration-200",
                !open && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex-1 min-h-0 overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1">
          <div className="py-4 overflow-y-auto h-full min-h-0">
            <div className="space-y-1">
              {workspaceMembers?.length ? (
                workspaceMembers.map((m) => (
                  <div
                    key={m.id}
                    className="w-full hover:bg-muted hover:text-foreground p-2 rounded-md cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 w-full justify-start">
                      <UserAvatar
                        name={m.user.name}
                        image={m.user.image}
                        className="size-12"
                      />
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold">
                          {m.user.name}
                        </span>
                        <span className="text-muted-foreground">
                          {m.user.email}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : currentUserMember?.role === "owner" ||
                currentUserMember?.role === "admin" ? (
                <div className="w-full p-5 rounded-lg border-2 border-dashed bg-card">
                  <h1 className="text-lg font-bold">No Members Yet</h1>
                  <p className="text-sm font-medium text-muted-foreground">
                    Invite your teammates to get started.
                  </p>
                  {/* todo: implement invite members functionality */}
                  <Button className="w-full mt-4">
                    <UsersIcon />
                    Invite Members
                  </Button>
                </div>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  No members yet. Invite members to get started.
                </span>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const MembersListLoading = () => {
  return (
    <div className="border-t flex h-90 flex-col overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-18 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
      </div>
      <div className="mt-4 space-y-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-lg p-2">
            <Skeleton className="size-12 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-4 w-44 max-w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MembersListError = () => {
  return (
    <div className="border-t flex h-70 flex-col p-5">
      <div className="rounded-lg border border-dashed border-destructive/35 bg-destructive/8 p-4">
        <h2 className="text-sm font-semibold text-destructive">
          Unable to load members
        </h2>
        <p className="mt-1 text-sm text-destructive/80">
          Something went wrong while loading the workspace members. Please
          refresh and try again.
        </p>
      </div>
    </div>
  );
};
