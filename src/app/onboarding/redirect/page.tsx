import { db } from "@/db/db";
import { member, PricingPlan, subscription, user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { and, eq } from "drizzle-orm";
import { Loader2Icon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const OnboardingRedirect = () => {
  return (
    <Suspense fallback={<OnboardingRedirectLoading />}>
      <OnboardingRedirectSuspense />
    </Suspense>
  );
};

export default OnboardingRedirect;

const OnboardingRedirectLoading = () => {
  return (
    <div className="w-full h-svh flex items-center justify-center">
      <div className="p-10 rounded-lg border-2 border-dashed flex bg-card flex-col items-center gap-4 w-full max-w-150">
        <Loader2Icon className="text-primary size-10 animate-spin" />
        <h1 className="text-3xl font-bold text-center">
          Processing details...
        </h1>
        <p className="text-sm font-medium text-muted-foreground text-center">
          We are processing some information before you continue. This may take
          a few seconds.
        </p>
      </div>
    </div>
  );
};

const OnboardingRedirectSuspense = async () => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) return null;
  if (session && session.user.onboardingPhase === "completed")
    return redirect("/workspace");
  const teamMember = await db.query.member.findFirst({
    where: eq(member.userId, session.user.id),
  });
  if (!teamMember) return redirect("/onboarding");
  const activeSubscription = await db.query.subscription.findFirst({
    where: and(
      eq(subscription.referenceId, teamMember.organizationId),
      eq(subscription.status, "active"),
    ),
  });
  if (activeSubscription) {
    await db
      .update(user)
      .set({
        plan: activeSubscription.plan as PricingPlan,
        onboardingPhase: "completed",
      })
      .where(eq(user.id, session?.user.id));
    return redirect("/workspace");
  } else {
    return redirect("/onboarding");
  }
};
