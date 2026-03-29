import { Dispatch, SetStateAction } from "react";
import { User } from "./auth/auth";
import { OnboardingPhase } from "@/db/schema";

export type SetterType<T> = Dispatch<SetStateAction<T>>;

export type OnboardingClientPhaseProps = {
  user: User;
  setOnboardingPhase: SetterType<OnboardingPhase>;
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: SetterType<string | null>;
};
