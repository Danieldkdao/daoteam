import { UserPlusIcon, UsersIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";

export const MessageHeader = ({ channelSlug }: { channelSlug: string }) => {
  return (
    <div className="px-5 h-16 border-b flex items-center gap-4">
      <h1 className="text-2xl font-bold flex-1 max-w-full truncate">
        # {channelSlug}
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <UserPlusIcon />
          Invite Member
        </Button>
        <Button variant="outline">
          <UsersIcon />
          Members
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};
