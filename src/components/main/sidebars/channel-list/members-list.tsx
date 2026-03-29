"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export const MembersList = () => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={cn(
        "border-t flex h-70 flex-col overflow-hidden p-5 transition-[height] duration-200",
        open && "h-90",
      )}
    >
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="flex flex-1 flex-col min-h-0"
      >
        <CollapsibleTrigger className="w-full shrink-0">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-muted-foreground">Members</span>
            <ChevronDownIcon
              className={cn(
                "text-muted-foreground size-4 transition-discrete duration-200",
                !open && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex-1 min-h-0 overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1">
          <div className="py-4 overflow-y-auto h-full min-h-0">
            <div className="space-y-1">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full hover:bg-muted hover:text-foreground p-2 rounded-md cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 w-full justify-start">
                    <UserAvatar
                      name="Daniel Dao"
                      image={null}
                      className="size-12"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">Daniel Dao</span>
                      <span className="text-muted-foreground">
                        danieldkdao@gmail.com
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
