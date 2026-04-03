"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreateWorkspaceModal } from "@/components/workspace/create-workspace-modal";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const CreateWorkspaceButton = ({
  mobile = false,
}: {
  mobile?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateWorkspaceModal open={open} setOpen={setOpen} />
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className={cn(
              "rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-primary/30 transition-[colors_discrete] duration-150 cursor-pointer active:scale-97",
              mobile ? "size-16 shrink-0" : "w-full h-20",
            )}
          >
            <PlusIcon
              strokeWidth={3}
              className={cn(
                "text-muted-foreground",
                mobile ? "size-6" : "size-8",
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent align="center" side={mobile ? "bottom" : "right"}>
          Create Workspace
        </TooltipContent>
      </Tooltip>
    </>
  );
};
