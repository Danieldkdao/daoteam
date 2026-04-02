"use client";

import { authClient } from "@/lib/auth/auth-client";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Subscription } from "@better-auth/stripe";

type PlanCardProps = {
  title: string;
  plan: string;
  price: number;
  features: string[];
  isMostPopular: boolean;
  currentWorkspaceId: string | null;
  activeSubscription?: Subscription | null;
  isPending?: boolean;
};

export const PlanCard = ({
  title,
  plan,
  price,
  features,
  isMostPopular,
  currentWorkspaceId,
  activeSubscription,
  isPending,
}: PlanCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, isPending: authPending } = authClient.useSession();
  const { data: activeWorkspace } = authClient.useActiveOrganization();

  const handleSelectPlan = async () => {
    setLoading(true);
    if (plan === "free") {
      if (activeSubscription && currentWorkspaceId) {
        await authClient.subscription.cancel({
          subscriptionId: activeSubscription.id,
          customerType: "organization",
          referenceId: currentWorkspaceId,
          returnUrl: window.location.href,
          fetchOptions: {
            onSuccess: async () => {
              await authClient.updateUser({
                plan: "free",
              });
            },
          },
        });
        return;
      }

      await authClient.updateUser({
        onboardingPhase: "completed",
        plan: "free",
        fetchOptions: {
          onSuccess: () => {
            router.push("/workspace");
          },
          onError: (error) => {
            toast.error(
              error.error.message ||
                "Something went wrong. Please try again or come back later.",
            );
          },
        },
      });
      setLoading(false);
      return;
    }

    if (!currentWorkspaceId && !activeWorkspace?.id) {
      setLoading(false);
      return toast.error(
        "Something went wrong. Please try again or come back later.",
      );
    }

    await authClient.subscription.upgrade(
      {
        plan,
        referenceId: currentWorkspaceId ?? activeWorkspace?.id,
        customerType: "organization",
        successUrl: session ? window.location.href : "/onboarding/redirect",
        cancelUrl: window.location.href,
        returnUrl: window.location.href,
        disableRedirect: false,
      },
      {
        onSuccess: async () => {
          await authClient.updateUser({
            plan,
          });
        },
        onError: (error) => {
          toast.success(
            error.error.message ||
              "Something went wrong. Failed to apply subscription.",
          );
        },
      },
    );
    setLoading(false);
  };

  const handleBillingPortal = async () => {
    if (!currentWorkspaceId) return toast.error("No organization found.");
    await authClient.subscription.billingPortal({
      returnUrl: window.location.href,
      customerType: "organization",
      referenceId: currentWorkspaceId,
    });
  };

  const pending = loading || isPending || authPending;
  const isActivePlan = activeSubscription?.plan === plan;

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
          variant={isActivePlan ? "outline" : "default"}
          onClick={isActivePlan ? handleBillingPortal : handleSelectPlan}
          disabled={pending}
        >
          <LoadingSwap isLoading={pending}>
            {session?.user.onboardingPhase !== "completed"
              ? "Select Plan"
              : isActivePlan
                ? "Manage Plan"
                : "Select Plan"}
          </LoadingSwap>
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          *All limits are shared across the organization.
        </span>
      </div>
    </div>
  );
};
