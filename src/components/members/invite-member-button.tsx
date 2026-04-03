"use client";

import { UserPlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { InviteMemberModal } from "./invite-member-modal";

export const InviteMemberButton = ({
  variant = "outline",
  className,
  workspaceId,
  compact = false,
}: {
  variant?: "default" | "outline";
  className?: string;
  workspaceId: string;
  compact?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <InviteMemberModal
        open={open}
        setOpen={setOpen}
        workspaceId={workspaceId}
      />
      <Button
        variant={variant}
        onClick={() => setOpen(true)}
        aria-label="Invite member"
        className={cn(compact && "size-9 px-0", className)}
      >
        <UserPlusIcon />
        {!compact ? "Invite Member" : null}
      </Button>
    </>
  );
};
