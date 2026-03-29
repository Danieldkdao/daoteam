import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UserAvatar } from "@/components/user-avatar";
import { ChevronDownIcon } from "lucide-react";

export const MembersList = () => {
  return (
    <div className="p-5 min-h-20 max-h-60 border-t flex flex-col">
      <Collapsible className="flex flex-col min-h-0">
        <CollapsibleTrigger className="w-full shrink-0">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-muted-foreground">Members</span>
            <ChevronDownIcon className="text-muted-foreground size-4" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4 overflow-y-auto min-h-0">
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, index) => (
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
