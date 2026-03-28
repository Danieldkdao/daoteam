import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-svh py-10 px-6 flex items-center justify-center">
      <Suspense>
        <AuthLayoutSuspense>{children}</AuthLayoutSuspense>
      </Suspense>
    </div>
  );
};

export default AuthLayout;

export const AuthLayoutSuspense = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) return redirect("/workspace");
  return children;
};
