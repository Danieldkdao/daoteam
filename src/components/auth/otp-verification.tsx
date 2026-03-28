"use client";

import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { LoadingSwap } from "../ui/loading-swap";

const formSchema = z.object({
  otp: z
    .string()
    .length(6, { error: "OTP code must be exactly 6 characters long." }),
});

type FormType = z.infer<typeof formSchema>;

export const OtpVerification = ({ verifyEmail }: { verifyEmail: string }) => {
  const router = useRouter();
  const [timeToResend, setTimeToResend] = useState(30);
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (timeToResend === 0) return;
    const interval = setInterval(() => {
      if (timeToResend === 0) return;
      setTimeToResend((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToResend]);

  const handleResendOtp = async () => {
    if (timeToResend !== 0) return;
    await authClient.emailOtp.sendVerificationOtp({
      email: verifyEmail,
      type: "email-verification",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Verification code sent successfully!");
        },
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to send verification email.",
          );
        },
      },
    });
  };

  const handleOtpVerification = async ({ otp }: FormType) => {
    await authClient.emailOtp.verifyEmail(
      {
        email: verifyEmail,
        otp,
      },
      {
        onSuccess: () => {
          toast.success("Email verified successfully!");
          router.push("/workspace");
        },
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Something went wrong. Failed to verify OTP.",
          );
        },
      },
    );
  };

  return (
    <div className="w-full max-w-100 space-y-4">
      <div className="w-full rounded-md bg-primary p-4 space-y-2">
        <h1 className="text-3xl font-bold text-background">DaoTeam</h1>
        <span className="text-background">
          We've sent a 6 digit verification code to{" "}
          <span className="font-medium">{verifyEmail}</span>. Enter the code to
          verify your email address.
        </span>
      </div>
      <form
        onSubmit={form.handleSubmit(handleOtpVerification)}
        className="space-y-4"
      >
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <InputOTP maxLength={6} {...field}>
                <InputOTPGroup className="flex gap-4 items-center justify-between w-full">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-1 gap-2">
          <Button disabled={form.formState.isSubmitting}>
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              Verify email
            </LoadingSwap>
          </Button>
          <Button
            disabled={form.formState.isSubmitting || timeToResend !== 0}
            type="button"
            variant="outline"
            onClick={handleResendOtp}
          >
            <span className="tabular-nums">
              {timeToResend !== 0
                ? `Resend in (${timeToResend})`
                : "Resend code"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};
