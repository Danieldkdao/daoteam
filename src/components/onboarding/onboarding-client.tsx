"use client";

import { OnboardingPhase } from "@/db/schema";
import { User } from "@/lib/auth/auth";
import { JSX, useState } from "react";
import { CreateOrganizationPhase } from "./create-organization-phase";
import { OnboardingClientPhaseProps } from "@/lib/types";
import { SelectPlanPhase } from "./select-plan-phase";
import { CompletedPhase } from "./completed-phase";

const onboardingPhaseComponentMap: Record<
  OnboardingPhase,
  (props: OnboardingClientPhaseProps) => JSX.Element
> = {
  "create-organization": CreateOrganizationPhase,
  "select-plan": SelectPlanPhase,
  completed: CompletedPhase,
};

export const OnboardingClient = ({ user }: { user: User }) => {
  const [onboardingPhase, setOnboardingPhase] = useState<OnboardingPhase>(
    user.onboardingPhase as OnboardingPhase,
  );
  const Component = onboardingPhaseComponentMap[onboardingPhase];

  return <Component user={user} setOnboardingPhase={setOnboardingPhase} />;
};
