import { Dispatch, SetStateAction } from "react";
import { User } from "./auth/auth";
import { OnboardingPhase } from "@/db/schema";
import { PAID_FEATURES } from "./constants";

export type SetterType<T> = Dispatch<SetStateAction<T>>;

export type OnboardingClientPhaseProps = {
  user: User;
  setOnboardingPhase: SetterType<OnboardingPhase>;
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: SetterType<string | null>;
};

export type MarkdownStorage = {
  markdown: {
    getMarkdown: () => string;
  };
};

export type GetEditorConfigParams = {
  message: string;
  setMessage: SetterType<string>;
};

export type PaidFeature = (typeof PAID_FEATURES)[number];
