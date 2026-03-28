"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OtpVerification } from "@/components/auth/otp-verification";

const formSchema = z.object({
  email: z.email({ error: "Invalid email." }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .max(128, { error: "Password cannot be longer than 128 characters." }),
});

type FormType = z.infer<typeof formSchema>;

const SignInPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  const [socialSignInLoading, setSocialSignInLoading] = useState(false);
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session && !session.user.emailVerified) {
      authClient.emailOtp.sendVerificationOtp({
        email: session.user.email,
        type: "email-verification",
        fetchOptions: {
          onSuccess: () => {
            setVerifyEmail(session.user.email);
          },
          onError: (error) => {
            toast.error(
              error.error.message || "Failed to send verification email.",
            );
          },
        },
      });
    }
  }, []);

  const handleSignIn = async (data: FormType) => {
    await authClient.signIn.email(
      {
        ...data,
        callbackURL: "/workspace",
      },
      {
        onSuccess: () => {
          toast.success("Signed in successfully!");
          router.push("/workspace");
        },
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            setVerifyEmail(data.email);
          }
          toast.error(
            error.error.message ||
              "Something went wrong. Failed to authenticate.",
          );
        },
      },
    );
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialSignInLoading(true);
    await authClient.signIn.social({
      provider,
      callbackURL: "/workspace",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed in successfully!");
          setSocialSignInLoading(false);
        },
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Something went wrong. Failed to authenticate.",
          );
          setSocialSignInLoading(false);
        },
      },
    });
  };

  if (verifyEmail) {
    return <OtpVerification verifyEmail={verifyEmail} />;
  }

  const isPending = socialSignInLoading || form.formState.isSubmitting;

  return (
    <div className="w-full max-w-100 space-y-4">
      <div className="w-full rounded-md bg-primary p-4 space-y-2">
        <h1 className="text-3xl font-bold text-background">DaoTeam</h1>
        <span className="text-background">Sign in to continue</span>
      </div>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSignIn)}
      >
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input {...field} placeholder="email@example.com" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input {...field} type="password" placeholder="••••••••" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button className="w-full" disabled={isPending}>
          <LoadingSwap isLoading={isPending}>Sign in</LoadingSwap>
        </Button>
      </form>

      <div className="flex items-center gap-2">
        <Separator className="w-auto flex-1" />
        <span className="text-muted-foreground font-medium">OR</span>
        <Separator className="w-auto flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => handleSocialSignIn("google")}
          disabled={isPending}
          variant="outline"
          className=""
        >
          <LoadingSwap
            isLoading={isPending}
            className="flex items-center gap-2"
          >
            <FaGoogle />
            Google
          </LoadingSwap>
        </Button>
        <Button
          onClick={() => handleSocialSignIn("github")}
          disabled={isPending}
          variant="outline"
        >
          <LoadingSwap
            isLoading={isPending}
            className="flex items-center gap-2"
          >
            <FaGithub />
            GitHub
          </LoadingSwap>
        </Button>
      </div>

      <Link
        href="/sign-up"
        className="text-sm font-medium text-muted-foreground"
      >
        Don't have an account? Sign up here.
      </Link>
    </div>
  );
};

export default SignInPage;
