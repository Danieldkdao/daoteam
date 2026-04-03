import { SettingsIcon } from "lucide-react";
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
  return (
    <div className="px-5 h-16 border-b flex items-center gap-4">
      <h1 className="text-2xl font-bold flex-1 max-w-full truncate">
        # {channelSlug}
      </h1>
      <div className="flex items-center gap-2">
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
    </div>
  );
};
