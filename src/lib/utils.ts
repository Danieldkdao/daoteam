import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "./auth/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createSlug = (text: string) => {
  return text.toLowerCase().replaceAll(/\s+/g, "-");
};

export const redirectUserSession = (user: User | undefined) => {
  if (!user) return "/sign-in";
  if (user && user.onboardingPhase !== "completed") return "/onboarding";
  return "/workspace";
};
