"use client";

import { createOrganization } from "@/lib/actions/organization.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LoadingSwap } from "../ui/loading-swap";
import { OnboardingClientPhaseProps } from "@/lib/types";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Please enter an organization name." }),
});

type FormType = z.infer<typeof formSchema>;

export const CreateOrganizationPhase = ({
  user,
  setOnboardingPhase,
}: OnboardingClientPhaseProps) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${user.name}'s Organization`,
    },
  });

  const handleCreateOrganization = async ({ name }: FormType) => {
    const response = await createOrganization(name);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setOnboardingPhase("select-plan");
    }
  };

  return (
    <div className="w-full max-w-100 space-y-4">
      <div className="w-full rounded-md bg-primary p-4 space-y-2">
        <h1 className="text-3xl font-bold text-background">DaoTeam</h1>
        <span className="text-background">Create your first organization</span>
      </div>
      <form
        onSubmit={form.handleSubmit(handleCreateOrganization)}
        className="space-y-4"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Organization Name</FieldLabel>
              <Input {...field} placeholder="My Default Organization" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button className="w-full" disabled={form.formState.isSubmitting}>
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Continue
          </LoadingSwap>
        </Button>
      </form>
    </div>
  );
};
