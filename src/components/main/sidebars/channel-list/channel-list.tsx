"use client";

import { CreateChannelButton } from "@/components/channel/create-channel-button";
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
  const { channelId } = useParams() as { channelId: string | undefined };

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col space-y-4 overflow-hidden p-5 transition-[flex-grow] duration-300 ease-out",
        open && "flex-1",
      )}
    >
      <CreateChannelButton />
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className={cn(
          "flex min-h-0 flex-col overflow-hidden rounded-lg transition-[flex-grow] duration-300 ease-out",
          open && "flex-1",
        )}
      >
        <CollapsibleTrigger className="w-full shrink-0">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-muted-foreground">Main</span>
            <ChevronDownIcon
              className={cn(
                "text-muted-foreground size-4 transition-transform duration-300 ease-out",
                !open && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="min-h-0 overflow-hidden transition-[flex-grow] duration-300 ease-out data-[state=open]:flex-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1">
          <div className="h-full min-h-0 space-y-1 overflow-y-auto py-4">
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
    </div>
  );
};
