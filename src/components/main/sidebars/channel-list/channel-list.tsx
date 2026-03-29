"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { GetProcedureOutput } from "@/trpc/types";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export const ChannelList = ({
  channels,
}: {
  channels: GetProcedureOutput<"channel", "getMany">;
}) => {
  const [open, setOpen] = useState(true);
  const { channelId }: { channelId: string | undefined } = useParams();

  return (
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
          {channels.length ? (
            channels.map((c) => {
              const isActive = c.id === channelId;

              return (
                <Link
                  key={c.id}
                  href={`/workspace/${c.organizationId}/channel/${c.id}`}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full",
                      isActive &&
                        "bg-primary/30 hover:bg-primary/35 transition-colors duration-200",
                    )}
                  >
                    <div className="flex items-center gap-2 w-full justify-start">
                      <span className="text-lg font-medium text-muted-foreground">
                        #
                      </span>
                      <span className="text-lg font-medium text-muted-foreground truncate">
                        {c.slug}
                      </span>
                    </div>
                  </Button>
                </Link>
              );
            })
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              No channels yet. Create one to start.
            </span>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
