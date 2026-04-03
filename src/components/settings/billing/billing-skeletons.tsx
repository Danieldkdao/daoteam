import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const PlanCardSkeleton = () => {
  return (
    <div className="bg-card p-10 border border-border rounded-lg flex flex-col gap-8 h-full w-full">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      <div className="flex items-end gap-3">
        <Skeleton className="h-14 w-28" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Separator />
      <div className="flex flex-col gap-8 flex-1 justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-5 w-44" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-4 w-60" />
      </div>
    </div>
  );
};

export const ActiveSubscriptionSkeleton = () => {
  return (
    <div className="w-full p-5 rounded-lg border bg-card shadow-sm space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-10 w-full md:w-32 rounded-lg" />
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-3">
          <Skeleton className="h-14 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
};

export const PlanGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PlanCardSkeleton />
      <PlanCardSkeleton />
    </div>
  );
};
