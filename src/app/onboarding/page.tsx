import { OnboardingClient } from "@/components/onboarding/onboarding-client";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const OnboardingPage = () => {
  return (
    <Suspense>
      <OnboardingSuspense />
    </Suspense>
  );
};

export default OnboardingPage;

const OnboardingSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/sign-in");
  if (session && session.user.onboardingPhase === "completed")
    return redirect("/workspace");

  return (
    <div className="w-full min-h-svh py-10 px-6 flex items-center justify-center">
      <OnboardingClient user={session.user} />
    </div>
  );
};
