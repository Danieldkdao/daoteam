import { AcceptInvitationView } from "@/components/invitation/accept-invitation-view";
import { auth } from "@/lib/auth/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const AcceptInvitationPage = async ({
  params,
}: {
  params: Promise<{ invitationId: string }>;
}) => {
  const { invitationId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect(`/sign-in?invitation=${invitationId}`);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.invitation.getOne.queryOptions({ invitationId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AcceptInvitationView invitationId={invitationId} />
    </HydrationBoundary>
  );
};

export default AcceptInvitationPage;
