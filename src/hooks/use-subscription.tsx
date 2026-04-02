import { authClient } from "@/lib/auth/auth-client";
import { Subscription } from "@better-auth/stripe";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useSubscription = (workspaceId: string | null) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadSubscriptions = async () => {
      if (!workspaceId) {
        setSubscriptions([]);
        setIsPending(false);
        return;
      }

      setIsPending(true);

      const result = await authClient.subscription.list({
        query: {
          customerType: "organization",
          referenceId: workspaceId,
        },
      });

      if (isCancelled) return;

      if (result.error) {
        setSubscriptions([]);
        toast.error("Failed to load subscriptions.");
        return;
      }

      setSubscriptions(result.data ?? []);
    };

    void loadSubscriptions().finally(() => {
      if (!isCancelled) {
        setIsPending(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [workspaceId]);

  const activeSubscription = subscriptions.find(
    (subscription) =>
      subscription.status === "active" || subscription.status === "trialing",
  );

  return { subscriptions, activeSubscription, isPending };
};
