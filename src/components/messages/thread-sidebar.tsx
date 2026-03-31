import { MessageSquareIcon, SparklesIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { SendMessageField } from "./send-message";

export const ThreadSidebar = () => {
  return (
    <div className="border-l w-130 shrink-0 flex flex-col">
      <div className="px-5 h-16 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="size-5" />
          <span className="text-xl font-medium">Thread</span>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-full bg-linear-90 from-purple-700 to-fuchsia-600 text-white border-none px-4">
            <SparklesIcon className="text-white" />
            Summarize
          </Button>
          <Button
            variant="outline"
            className="size-11 sm:size-11 [&_svg:not([class*='size-'])]:size-5"
          >
            <XIcon />
          </Button>
        </div>
      </div>
      <div className="flex-1 h-full"></div>
      <div className="p-4 border-t">
        <SendMessageField channelId="" workspaceId="" />
        {/* todo: replace with custom sendThreadMessageField component */}
      </div>
    </div>
  );
};
