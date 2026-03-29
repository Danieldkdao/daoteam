"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { CreateWorkspaceModal } from "./create-workspace-modal";

export const NoWorkspacesYet = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateWorkspaceModal open={open} setOpen={setOpen} />
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col gap-2 w-full max-w-120 p-10 bg-card border-2 border-dashed rounded-lg">
          <h1 className="text-2xl font-bold">No Workspaces Yet</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Create your first workspace to begin inviting members of your team
            to join and collaborate.
          </p>
          <Button className="mt-4" onClick={() => setOpen(true)}>
            Create Workspace
          </Button>
        </div>
      </div>
    </>
  );
};
