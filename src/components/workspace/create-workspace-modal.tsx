"use client";

import { SetterType } from "@/lib/types";
import { ResponsiveDialog } from "../responsive-dialog";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Please enter a name for your new workspace." }),
});

type FormType = z.infer<typeof formSchema>;

type CreateWorkspaceModalProps = {
  open: boolean;
  setOpen: SetterType<boolean>;
};

export const CreateWorkspaceModal = ({
  open,
  setOpen,
}: CreateWorkspaceModalProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const createWorkspace = useMutation(
    trpc.workspace.create.mutationOptions({
      onSuccess: async ({ message, workspace }) => {
        await queryClient.invalidateQueries(trpc.workspace.getMany.queryOptions());

        toast.success(message);
        router.push(`/workspace/${workspace.id}`);
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleCreateWorkspace = async ({ name }: FormType) => {
    await createWorkspace.mutateAsync({ name });
  };

  const pending =
    form.formState.isSubmitting || createWorkspace.isPending;

  return (
    <ResponsiveDialog
      title="Create Workspace"
      description="Create a new workspace to get started"
      open={open}
      onChange={setOpen}
      dialogClassName="sm:max-w-100 max-w-100"
    >
      <form
        onSubmit={form.handleSubmit(handleCreateWorkspace)}
        className="space-y-4 w-full"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...field} placeholder="My Workspace" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          className="w-full"
          disabled={pending || !form.formState.isDirty}
        >
          <LoadingSwap isLoading={pending}>
            Create Workspace
          </LoadingSwap>
        </Button>
      </form>
    </ResponsiveDialog>
  );
};
