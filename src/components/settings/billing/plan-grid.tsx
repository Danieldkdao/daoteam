"use client";

import { PlanCard } from "@/components/pricing/plan-card";
import { PricingPlan } from "@/db/schema";
import { useSubscription } from "@/hooks/use-subscription";
import { PLAN_DETAILS } from "@/lib/constants";
import { PlanGridSkeleton } from "./billing-skeletons";

export const PlanGrid = ({ workspaceId }: { workspaceId: string }) => {
  const { activeSubscription, isPending } = useSubscription(workspaceId);
  const plan = (activeSubscription?.plan ?? "free") as PricingPlan;

  if (isPending) return <PlanGridSkeleton />;

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
