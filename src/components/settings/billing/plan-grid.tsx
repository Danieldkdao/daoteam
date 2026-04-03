"use client";

import { PlanCard } from "@/components/pricing/plan-card";
import { PricingPlan } from "@/db/schema";
import { useSubscription } from "@/hooks/use-subscription";
import { PLAN_DETAILS } from "@/lib/constants";
import { BillingErrorState } from "./billing-error-state";
import { PlanGridSkeleton } from "./billing-skeletons";

export const PlanGrid = ({ workspaceId }: { workspaceId: string }) => {
  const { activeSubscription, isPending, isError } = useSubscription(workspaceId);
  const plan = (activeSubscription?.plan ?? "free") as PricingPlan;

  if (isPending) return <PlanGridSkeleton />;
  if (isError) {
    return (
      <BillingErrorState
        workspaceId={workspaceId}
        title="Couldn't load available plans"
        description="The available upgrade options couldn't be loaded right now. Try again in a moment or head back to your workspace."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PLAN_DETAILS.map((p) => {
        if (p.plan === plan) return;
        return (
          <PlanCard
            key={p.plan}
            {...p}
            currentWorkspaceId={workspaceId}
            activeSubscription={activeSubscription}
            isPending={isPending}
          />
        );
      })}
    </div>
  );
};
