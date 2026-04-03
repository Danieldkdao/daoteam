import { UnauthorizedState } from "@/components/unauthorized-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsageAction } from "@/lib/actions/usage.action";
import { InfinityIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type UsageParamProps = {
  params: Promise<{ workspaceId: string }>;
};

const UsagePage = ({ params }: UsageParamProps) => {
  return (
    <div className="space-y-8 mb-10">
      <div>
        <h1 className="text-4xl font-bold">Usage</h1>
        <span className="text-base text-muted-foreground font-medium">
          View usage and limits across your workspace.
        </span>
      </div>
      <Suspense fallback={<UsagePageSuspenseLoading />}>
        <UsagePageSuspense params={params} />
      </Suspense>
    </div>
  );
};

const UsagePageSuspenseLoading = () => {
  return (
    <div className="space-y-8">
      <UsageUsageCardSkeleton />
      <UsageUsageCardSkeleton />
      <>
        <Separator />
        <div className="flex items-center gap-2 justify-between flex-wrap bg-card p-5 rounded-lg shadow-sm border">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </>
    </div>
  );
};

const UsageUsageCardSkeleton = () => {
  return (
    <div className="p-5 rounded-lg bg-card shadow-sm border space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <Skeleton className="h-8 w-56" />
        <div className="flex items-end gap-1">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-5 w-4" />
          <Skeleton className="h-5 w-8" />
        </div>
      </div>

      <Skeleton className="h-2.5 w-full rounded-full" />
      <Skeleton className="h-5 w-44" />
    </div>
  );
};

const UsagePageSuspense = async ({ params }: UsageParamProps) => {
  const { workspaceId } = await params;
  const limitInfo = await getUsageAction(workspaceId);

  if (!limitInfo) {
    return (
      <UnauthorizedState description="You need admin or owner access to view workspace usage details." />
    );
  }

  const now = new Date();
  const resetsOn = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const aiMessagesLimit = limitInfo.aiMessages.limit;
  const aiMessagesUsage = limitInfo.aiMessages.usage;

  const aiThreadSummariesLimit = limitInfo.aiThreadSummaries.limit;
  const aiThreadSummariesUsage = limitInfo.aiThreadSummaries.usage;

  const aiMessageProgress = (aiMessagesUsage / (aiMessagesLimit ?? 0)) * 100;
  const aiThreadSummariesProgress =
    (aiThreadSummariesUsage / (aiThreadSummariesLimit ?? 0)) * 100;

  return (
    <div className="space-y-8">
      <div className="p-5 rounded-lg bg-card shadow-sm border space-y-4">
        <div className="flex items-center gap-4 justify-between flex-wrap">
          <span className="text-2xl font-bold">AI Generated Messages</span>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-foreground">
              {aiMessagesLimit && aiMessagesUsage > aiMessagesLimit
                ? aiMessagesLimit
                : aiMessagesUsage}
            </span>
            <span className="text-muted-foreground text-base font-medium">
              /
            </span>
            {limitInfo.aiMessages ? (
              <span className="text-muted-foreground text-base font-medium">
                {aiMessagesLimit}
              </span>
            ) : (
              <InfinityIcon className="text-muted-foreground" />
            )}
          </div>
        </div>

        <Progress value={aiMessageProgress} />
        <span>
          Resets on{" "}
          {resetsOn.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="p-5 rounded-lg bg-card shadow-sm border space-y-4">
        <div className="flex items-center gap-2 justify-between">
          <span className="text-2xl font-bold">AI Thread Summaries</span>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-foreground">
              {aiThreadSummariesLimit &&
              aiThreadSummariesUsage > aiThreadSummariesLimit
                ? aiThreadSummariesLimit
                : aiThreadSummariesUsage}
            </span>
            <span className="text-muted-foreground text-base font-medium">
              /
            </span>
            {limitInfo.aiThreadSummaries ? (
              <span className="text-muted-foreground text-base font-medium">
                {aiThreadSummariesLimit}
              </span>
            ) : (
              <InfinityIcon className="text-muted-foreground" />
            )}
          </div>
        </div>

        <Progress value={aiThreadSummariesProgress} />
        <span>
          Resets on{" "}
          {resetsOn.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      {limitInfo.plan !== "enterprise" && (
        <>
          <Separator />
          <div className="flex items-center gap-2 justify-between flex-wrap bg-card p-5 rounded-lg shadow-sm border">
            <span className="text-lg font-medium">
              Upgrade for higher limits
            </span>
            <Link href={`/workspace/${workspaceId}/settings/billing`}>
              <Button>Upgrade</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default UsagePage;
