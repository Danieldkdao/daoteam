"use client";

import { PLAN_DETAILS } from "@/lib/constants";
import { PlanCard } from "../pricing/plan-card";
import { OnboardingClientPhaseProps } from "@/lib/types";

export const SelectPlanPhase = ({
  currentWorkspaceId,
}: OnboardingClientPhaseProps) => {
  return (
    <div className="flex flex-col items-center gap-12">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold text-center">
          Pricing that scales with you
        </h1>
        <p className="text-center text-muted-foreground">
          Choose the plan that best supports your needs. You can always upgrade
          or cancel at anytime.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-300">
        {PLAN_DETAILS.map((details) => (
          <PlanCard
            key={details.plan}
            {...details}
            currentWorkspaceId={currentWorkspaceId}
          />
        ))}
      </div>
    </div>
  );
};
