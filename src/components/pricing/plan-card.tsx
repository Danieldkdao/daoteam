"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { Separator } from "../ui/separator";

type PlanCardProps = {
  title: string;
  plan: string;
  price: number;
  features: string[];
  isMostPopular: boolean;
  currentWorkspaceId: string | null;
};

export const PlanCard = ({
  title,
  plan,
  price,
  features,
  isMostPopular,
  currentWorkspaceId,
}: PlanCardProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: activeWorkspace } = authClient.useActiveOrganization();
  const continueWithFreePlan = useMutation(
    trpc.pricing.continueWithFreePlan.mutationOptions({
      onSuccess: () => {
        router.push("/workspace");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleSelectPlan = async () => {
    if (plan === "free") {
      await continueWithFreePlan.mutateAsync();
      return;
    }

    if (!currentWorkspaceId && !activeWorkspace?.id)
      return toast.error(
        "Something went wrong. Please try again or come back later.",
      );
    await authClient.subscription.upgrade(
      {
        plan,
        referenceId: currentWorkspaceId ?? activeWorkspace?.id,
        customerType: "organization",
        successUrl: "/onboarding/redirect",
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
        <Button
          onClick={handleSelectPlan}
          disabled={continueWithFreePlan.isPending}
        >
          <LoadingSwap isLoading={continueWithFreePlan.isPending}>
            Select plan
          </LoadingSwap>
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          *All limits are shared across the organization.
        </span>
      </div>
    </div>
  );
};
