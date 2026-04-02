import { ActiveSubscription } from "@/components/settings/billing/active-subscription";
import { PlanGrid } from "@/components/settings/billing/plan-grid";

const BillingPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  const { workspaceId } = await params;

  return (
    <div className="space-y-8 mb-10">
      <div>
        <h1 className="text-4xl font-bold">Billing</h1>
        <span className="text-base text-muted-foreground font-medium">
          Manage your subscriptions and billing details.
        </span>
      </div>
      <ActiveSubscription workspaceId={workspaceId} />
      <PlanGrid workspaceId={workspaceId} />
    </div>
  );
};

export default BillingPage;
