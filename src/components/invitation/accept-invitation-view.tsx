"use client";

import { useConfirm } from "@/hooks/use-confirm";
import { authClient } from "@/lib/auth/auth-client";
import { useTRPC } from "@/trpc/client";
import {
  QueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { Skeleton } from "../ui/skeleton";

type AcceptInvitationProps = {
  invitationId: string;
};

export const AcceptInvitationView = (props: AcceptInvitationProps) => {
  return (
    <Suspense fallback={<AcceptInvitationLoading />}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={AcceptInvitationError}
          >
            <AcceptInvitationSuspense {...props} />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Suspense>
  );
};

const AcceptInvitationLoading = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="flex w-full max-w-150 flex-col gap-5 rounded-lg border-2 border-dashed border-border bg-card p-10">
        <div className="mx-auto rounded-full bg-primary/10 p-3">
          <Skeleton className="size-10 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-9 w-64 max-w-full rounded-lg" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
          <Skeleton className="h-4 w-80 max-w-full rounded-md" />
          <Skeleton className="h-4 w-72 max-w-full rounded-md" />
        </div>
        <div className="mt-2 grid w-full grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

const AcceptInvitationError = ({ resetErrorBoundary }: FallbackProps) => {
  const router = useRouter();

  const handleRetry = () => {
    resetErrorBoundary();
    router.refresh();
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="flex w-full max-w-150 flex-col gap-4 rounded-lg border border-dashed border-destructive/35 bg-destructive/8 p-10">
        <div className="mx-auto rounded-full bg-destructive/12 p-3">
          <TriangleAlertIcon className="size-10 text-destructive" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-destructive">
            Unable to load invitation
          </h1>
          <p className="text-sm font-medium text-destructive/80">
            Something went wrong while loading this invitation. Please try
            again, or come back in a moment.
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-80 justify-center">
          <Button variant="outline" className="w-full" onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

const AcceptInvitationSuspense = ({ invitationId }: AcceptInvitationProps) => {
  const trpc = useTRPC();
  const { data: invitation } = useSuspenseQuery(
    trpc.invitation.getOne.queryOptions({ invitationId }),
  );
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Rejection",
    "Are you sure you want to reject this invitation?",
  );

  const handleRejection = async () => {
    setLoading(true);
    const confirmation = await confirm();
    if (!confirmation) {
      setLoading(false);
      return;
    }

    await authClient.organization.rejectInvitation(
      {
        invitationId,
      },
      {
        onSuccess: () => {
          toast.success("Invitation rejected successfully!");
          router.push("/workspace");
        },
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Something went wrong. Please try again or come back later.",
          );
        },
      },
    );
    setLoading(false);
  };

  const handleAccept = async () => {
    setLoading(true);
    await authClient.organization.acceptInvitation({
      invitationId,
      fetchOptions: {
        onSuccess: async () => {
          await authClient.updateUser({
            onboardingPhase: "completed",
          });
          toast.success(
            `You have successfully joined the ${invitation.organization.name} workspace!`,
          );
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
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="w-full h-svh flex items-center justify-center">
        <div className="border-2 border-dashed border-border rounded-lg p-10 flex flex-col gap-4 bg-card w-full max-w-150">
          <h1 className="text-3xl font-bold text-center">
            Workspace Invitation
          </h1>
          <span className="text-base font-medium text-muted-foreground text-center">
            <span className="font-bold text-foreground">
              {invitation.user.name}
            </span>{" "}
            has invited you to join the{" "}
            <span className="font-bold text-foreground">
              {invitation.organization.name}
            </span>{" "}
            workspace.
          </span>
          <div className="grid grid-cols-2 gap-2 w-full ">
            <Button
              className="w-full"
              variant="destructive"
              onClick={handleRejection}
              disabled={loading}
            >
              <LoadingSwap isLoading={loading}>Reject Invitation</LoadingSwap>
            </Button>
            <Button
              className="w-full"
              onClick={handleAccept}
              disabled={loading}
            >
              <LoadingSwap isLoading={loading}>Accept Invitation</LoadingSwap>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
