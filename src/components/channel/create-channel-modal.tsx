"use client";

import { SetterType } from "@/lib/types";
import { ResponsiveDialog } from "../responsive-dialog";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChannel } from "@/lib/actions/channel.action";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { generateSlug } from "@/lib/utils";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Please enter a name for this channel." }),
});

type FormType = z.infer<typeof formSchema>;

type CreateChannelModalProps = {
  open: boolean;
  setOpen: SetterType<boolean>;
};

export const CreateChannelModal = ({
  open,
  setOpen,
}: CreateChannelModalProps) => {
  const router = useRouter();
  const params = useParams();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const orgId = params.workspaceId as string;

  const handleCreateChannel = async ({ name }: FormType) => {
    if (!orgId) return toast.error("No workspace found.");
    const response = await createChannel({ name, orgId });
    if (response.error || !response.channel) {
      toast.error(response.message);
    } else {
      toast.success("Channel created successfully!");
      router.push(
        `/workspace/${response.channel.organizationId}/channel/${response.channel.id}`,
      );
      setOpen(false);
      form.reset();
    }
  };

  const nameValue = form.watch("name");

  return (
    <ResponsiveDialog
      open={open}
      onChange={setOpen}
      title="Create Channel"
      description="Create a new channel to get started."
      dialogClassName="max-w-100 sm:max-w-100"
    >
      <form
        onSubmit={form.handleSubmit(handleCreateChannel)}
        className="space-y-4"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...field} placeholder="My New Channel" />
              <FieldDescription className="text-sm">
                Will be created as{" "}
                {nameValue.trim() && (
                  <span className="font-mono bg-sidebar rounded p-1 font-medium">
                    {generateSlug(nameValue)}
                  </span>
                )}
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Create Channel
          </LoadingSwap>
        </Button>
      </form>
    </ResponsiveDialog>
  );
};
