import { SignUpClient } from "@/components/auth/sign-up";

const SignUpPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ invitation?: string }>;
}) => {
  const { invitation } = await searchParams;

  return <SignUpClient invitation={invitation} />;
};

export default SignUpPage;
