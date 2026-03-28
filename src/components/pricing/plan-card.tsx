"use client";

import { CheckIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { continueWithFreePlan } from "@/lib/actions/pricing.action";

type PlanCardProps = {
  title: string;
  plan: string;
  price: number;
  features: string[];
  isMostPopular: boolean;
};

export const PlanCard = ({
  title,
  plan,
  price,
  features,
  isMostPopular,
}: PlanCardProps) => {
  const router = useRouter();
  const { data: activeSubscription, isPending } =
    authClient.useActiveOrganization();
  const handleSelectPlan = async () => {
    if (plan === "free") {
      const response = await continueWithFreePlan();
      if (response.error) {
        toast.error(response.error);
      } else {
        router.push("/workspace");
      }
      return;
    }
    await authClient.subscription.upgrade(
      {
        plan,
        referenceId: activeSubscription?.id,
        customerType: "organization",
        successUrl: window.location.href,
        cancelUrl: window.location.href,
        disableRedirect: false,
      },
      {
        onError: (error) => {
          toast.success(
            error.error.message ||
              "Something went wrong. Failed to apply subscription.",
          );
        },
      },
    );
  };

  return (
    <div className="bg-card p-10 border border-border rounded-lg flex flex-col gap-8 h-full w-full">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">{title} Plan</h1>
        {isMostPopular && <Badge>MOST POPULAR</Badge>}
      </div>

      <span className="text-muted-foreground">
        <span className="text-foreground text-5xl font-bold">${price}</span> USD
        / MONTH
      </span>
      <Separator />
      <div className="flex flex-col gap-8 flex-1 justify-between">
        <div className="space-y-2 flex-1">
          {features.map((feat, index) => (
            <div key={index} className="flex start gap-1">
              <CheckIcon className="text-primary" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
        <Button onClick={handleSelectPlan} disabled={isPending}>
          Select plan
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          *All limits are shared across the organization.
        </span>
      </div>
    </div>
  );
};
