"use client";

import { PricingPlan } from "@/db/schema";
import { PlanCard } from "../pricing/plan-card";

const planDetails: {
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
];

export const SelectPlanPhase = () => {
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
        {planDetails.map((details) => (
          <PlanCard key={details.plan} {...details} />
        ))}
      </div>
    </div>
  );
};
