import { OnboardingClient } from "@/components/onboarding/onboarding-client";
import { auth } from "@/lib/auth/auth";
import { redirectUserSession } from "@/lib/utils";
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
  const redirectUrl = redirectUserSession(session?.user);
  if (redirectUrl !== "/onboarding") return redirect(redirectUrl);

  return (
    <div className="w-full min-h-svh py-10 px-6 flex items-center justify-center">
      <OnboardingClient />
    </div>
  );
};
