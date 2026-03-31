"use client";

import { UserPlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { InviteMemberModal } from "./invite-member-modal";

export const InviteMemberButton = ({
  variant = "outline",
  className,
  workspaceId,
}: {
  variant?: "default" | "outline";
  className?: string;
  workspaceId: string;
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
        className={className}
      >
        <UserPlusIcon />
        Invite Member
      </Button>
    </>
  );
};
