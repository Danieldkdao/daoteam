import { GetProcedureOutput } from "@/trpc/types";
import { UserAvatar } from "../user-avatar";
import { useMemo } from "react";
import { MarkdownRenderer } from "../markdown-renderer";

export const Message = ({
  message,
}: {
  message: GetProcedureOutput<"message", "getMany">["messages"][number];
}) => {
  const formattedDate = useMemo(() => {
    const datePart = message.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timePart = message.createdAt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart} at ${timePart}`;
  }, [message.createdAt]);

  return (
    <div className="p-4 rounded-lg hover:bg-card transition-colors duration-200 flex items-start gap-4">
      <UserAvatar
        name={message.user.name}
        image={message.user.image}
        className="size-12"
        textClassName="text-xl font-medium"
      />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{message.user.name}</span>
          <span>{formattedDate}</span>
        </div>
        <div>
          <MarkdownRenderer>{message.message}</MarkdownRenderer>
        </div>
      </div>
    </div>
  );
};
