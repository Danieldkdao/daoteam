"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PricingPlan } from "@/db/schema";
import { useSubscription } from "@/hooks/use-subscription";
import { authClient } from "@/lib/auth/auth-client";
import { PLAN_DETAILS } from "@/lib/constants";
import { ActiveSubscriptionSkeleton } from "./billing-skeletons";

export const ActiveSubscription = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const { activeSubscription, isPending } = useSubscription(workspaceId);
  const plan = (activeSubscription?.plan ?? "free") as PricingPlan;

  if (isPending) return <ActiveSubscriptionSkeleton />;

  const planPrice = PLAN_DETAILS.find((p) => p.plan === plan)?.price ?? 0;

  const handleBillingPortal = async () => {
    await authClient.subscription.billingPortal({
      customerType: "organization",
      referenceId: workspaceId,
      returnUrl: window.location.href,
    });
  };

  return (
    <div className="w-full p-5 rounded-lg border bg-card shadow-sm space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            CURRENT PLAN
          </span>
          <h1 className="capitalize text-2xl font-bold">{plan} Plan</h1>
        </div>
        <Button
          variant="outline"
          className="w-full md:w-auto md:self-start"
          onClick={handleBillingPortal}
        >
          Manage Plan
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        <span className="text-base text-muted-foreground">
          <span className="text-5xl font-bold text-foreground">
            ${planPrice}
          </span>
          USD / MONTH
        </span>
        {activeSubscription?.periodEnd && (
          <p className="text-sm text-muted-foreground">
            {activeSubscription.cancelAtPeriodEnd
              ? "Cancels on "
              : "Renews on "}
            {activeSubscription.periodEnd.toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};
