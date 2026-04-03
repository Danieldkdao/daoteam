"use client";

import { useMainLayoutSidebar } from "@/components/main/main-layout-shell";
import { MenuIcon, SettingsIcon } from "lucide-react";
import { InviteMemberButton } from "../members/invite-member-button";
import { ShowMembersButton } from "../members/show-members-button";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import Link from "next/link";

export const MessageHeader = ({
  channelSlug,
  workspaceId,
}: {
  channelSlug: string;
  workspaceId: string;
}) => {
  const { openMobileSidebar } = useMainLayoutSidebar();

  return (
    <div className="flex h-16 min-w-0 items-center gap-2 border-b px-4 md:gap-4 md:px-5">
      <Button
        variant="outline"
        size="icon-sm"
        className="xl:hidden"
        onClick={openMobileSidebar}
      >
        <MenuIcon />
      </Button>
      <h1 className="min-w-0 flex-1 truncate text-xl font-bold md:text-2xl">
        # {channelSlug}
      </h1>

      <div className="hidden items-center gap-2 xl:flex">
        <InviteMemberButton workspaceId={workspaceId} />
        <ShowMembersButton workspaceId={workspaceId} />
        <Link href={`/workspace/${workspaceId}/settings/billing`}>
          <Button variant="outline">
            <SettingsIcon />
            Workspace
          </Button>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex shrink-0 items-center gap-2 xl:hidden">
        <InviteMemberButton workspaceId={workspaceId} compact />
        <ShowMembersButton workspaceId={workspaceId} compact />
        <Link href={`/workspace/${workspaceId}/settings/billing`}>
          <Button
            variant="outline"
            className="size-9 px-0"
            aria-label="Workspace settings"
          >
            <SettingsIcon />
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );
};
