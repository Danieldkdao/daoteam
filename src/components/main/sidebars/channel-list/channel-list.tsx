import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, PlusIcon } from "lucide-react";

export const ChannelList = () => {
  return (
    <div className="p-5 space-y-4 flex-1 flex flex-col min-h-0">
      <Button variant="outline" className="w-full shrink-0">
        <PlusIcon />
        Add Channel
      </Button>
      <Collapsible className="flex-1 flex flex-col min-h-0">
        <CollapsibleTrigger className="w-full shrink-0">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-muted-foreground">Main</span>
            <ChevronDownIcon className="text-muted-foreground size-4" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4 overflow-y-auto min-h-0">
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
