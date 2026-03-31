import { Skeleton } from "../ui/skeleton";

export const MessageSkeleton = ({
  align = "start",
  lines = 2,
}: {
  align?: "start" | "end";
  lines?: number;
}) => {
  const isEnd = align === "end";

  return (
    <div
      className={`flex items-start gap-4 rounded-lg p-4 ${
        isEnd ? "bg-card/50" : ""
      }`}
    >
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-4 w-36 rounded-md" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              className={`h-4 rounded-md ${
                index === lines - 1 ? "w-2/3" : "w-full"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
