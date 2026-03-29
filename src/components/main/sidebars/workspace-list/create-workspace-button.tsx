"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreateWorkspaceModal } from "@/components/workspace/create-workspace-modal";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const CreateWorkspaceButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateWorkspaceModal open={open} setOpen={setOpen} />
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg w-full h-20 border-2 border-dashed flex items-center justify-center hover:bg-primary/30 transition-[colors_discrete] duration-150 cursor-pointer active:scale-97"
          >
            <PlusIcon
              strokeWidth={3}
              className="size-8 text-muted-foreground"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent align="center" side="right">
          Create Workspace
        </TooltipContent>
      </Tooltip>
    </>
  );
};
