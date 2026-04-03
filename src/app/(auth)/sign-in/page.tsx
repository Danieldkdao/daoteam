import { SignInClient } from "@/components/auth/sign-in";

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ invitation?: string }>;
}) => {
  const { invitation } = await searchParams;

  return <SignInClient invitation={invitation} />;
};

export default SignInPage;
