"use client";

import { CreateChannelButton } from "@/components/channel/create-channel-button";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export const ChannelListClient = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-5 space-y-4 flex-1 flex flex-col min-h-0">
      <CreateChannelButton />
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="flex-1 flex flex-col min-h-0"
      >
        <CollapsibleTrigger className="w-full shrink-0">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-muted-foreground">Main</span>
            <ChevronDownIcon
              className={cn(
                "text-muted-foreground size-4 transition-discrete duration-200",
                !open && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4 overflow-y-auto min-h-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1">
          <div className="space-y-1">
            {Array.from({ length: 15 }).map((_, index) => (
              <Button key={index} variant="ghost" className="w-full">
                <div className="flex items-center gap-2 w-full justify-start">
                  <span className="text-lg font-medium text-muted-foreground">
                    #
                  </span>
                  <span className="text-lg font-medium text-muted-foreground">
                    Work on progress
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
