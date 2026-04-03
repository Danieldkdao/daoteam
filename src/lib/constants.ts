import { PricingPlan } from "@/db/schema";

export const UNAUTHED_MESSAGE = "Please sign in to continue.";
export const NO_PERMISSIONS_MESSAGE = "You do not have permission to do this.";

export const COLOR_COMBINATIONS = [
  "bg-blue-500 hover:bg-blue-600 text-white",
  "bg-emerald-500 hover:bg-emerald-600 text-white",
  "bg-purple-500 hover:bg-purple-600 text-white",
  "bg-amber-500 hover:bg-amber-600 text-white",
  "bg-rose-500 hover:bg-rose-600 text-white",
  "bg-indigo-500 hover:bg-indigo-600 text-white",
  "bg-cyan-500 hover:bg-cyan-600 text-white",
  "bg-pink-500 hover:bg-pink-600 text-white",
] as const;

export const PLAN_DETAILS: {
  title: string;
  plan: PricingPlan;
  price: number;
  features: string[];
  isMostPopular: boolean;
}[] = [
  {
    title: "Free",
    plan: "free",
    price: 0,
    features: [
      "Basic Email Support",
      "Up to 50 AI generated messages per month",
      "One AI generated thread summary per month",
      "Access to all core features",
    ],
    isMostPopular: false,
  },
  {
    title: "Pro",
    plan: "pro",
    price: 99,
    features: [
      "Everything in Free and:",
      "Priority Email Support",
      "Up to 500 AI generated messages per month",
      "5 AI generated thread summaries per month",
    ],
    isMostPopular: true,
  },
  {
    title: "Enterprise",
    plan: "enterprise",
    price: 500,
    features: [
      "Everything in Pro and:",
      "Unlimited AI generated messages",
      "Unlimited AI generated thread summary per month",
      "Advanced Features and Analytics",
    ],
    isMostPopular: false,
  },
] as const;

export const PAID_FEATURES = ["aiMessages", "aiThreadSummaries"] as const;
