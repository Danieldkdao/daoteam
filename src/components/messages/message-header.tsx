import { UsersIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { InviteMemberButton } from "../members/invite-member-button";

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
        <Button variant="outline">
          <UsersIcon />
          Members
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};
