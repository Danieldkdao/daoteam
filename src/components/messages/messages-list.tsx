"use client";

import { GetProcedureOutput } from "@/trpc/types";
import { BanIcon } from "lucide-react";
import { Message } from "./message";
import { useEffect, useRef } from "react";

export const MessagesList = ({
  messages,
}: {
  messages: GetProcedureOutput<"message", "getMany">["messages"];
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 h-full w-full overflow-auto min-h-0 max-h-full p-5 space-y-2"
    >
      {messages.length ? (
        messages.map((m) => <Message key={m.id} message={m} />)
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col gap-4 items-center">
            <div className="bg-primary/20 rounded-full p-4">
              <BanIcon className="text-primary size-14" />
            </div>
            <h1 className="text-2xl font-bold text-center">No Messages Yet</h1>
            <p className="text-muted-foreground text-sm font-medium text-center">
              Start the conversation by sending the first message.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
