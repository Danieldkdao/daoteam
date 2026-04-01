import { GetProcedureOutput } from "@/trpc/types";
import { UserAvatar } from "../user-avatar";
import { Badge } from "../ui/badge";

export const MemberItem = ({
  member,
}: {
  member: GetProcedureOutput<"workspace", "getMembers">["members"][number];
}) => {
  return (
    <div className="w-full flex justify-between items-start p-2 rounded-md hover:bg-primary/40">
      <div className="flex-1 min-w-0 flex gap-2">
        <UserAvatar
          name={member.user.name}
          image={member.user.image}
          className="size-10 shrink-0"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-base font-bold truncate">
            {member.user.name}
          </span>
          <span className="text-xs font-medium text-muted-foreground truncate">
            {member.user.email}
          </span>
        </div>
      </div>
      <Badge variant="secondary" className="capitalize">
        {member.role}
      </Badge>
    </div>
  );
};
