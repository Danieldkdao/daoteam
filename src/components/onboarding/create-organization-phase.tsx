"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LoadingSwap } from "../ui/loading-swap";
import { OnboardingClientPhaseProps } from "@/lib/types";
import { createWorkspace } from "@/lib/actions/workspace.action";

const formSchema = z.object({
  name: z.string().trim().min(1, { error: "Please enter an workspace name." }),
});

type FormType = z.infer<typeof formSchema>;

export const CreateOrganizationPhase = ({
  user,
  setOnboardingPhase,
  setCurrentWorkspaceId,
}: OnboardingClientPhaseProps) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${user.name}'s Workspace`,
    },
  });

  const handleCreateOrganization = async ({ name }: FormType) => {
    const response = await createWorkspace(name, true);
    if (response.error || !response.workspace) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setCurrentWorkspaceId(response.workspace.id);
      setOnboardingPhase("select-plan");
    }
  };

  return (
    <div className="w-full max-w-100 space-y-4">
      <div className="w-full rounded-md bg-primary p-4 space-y-2">
        <h1 className="text-3xl font-bold text-background">DaoTeam</h1>
        <span className="text-background">Create your first workspace</span>
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
              <FieldLabel>Workspace Name</FieldLabel>
              <Input {...field} placeholder="My First Workspace" />
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
