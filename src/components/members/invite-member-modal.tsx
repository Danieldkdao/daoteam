"use client";

import { SetterType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { ResponsiveDialog } from "../responsive-dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.email({ error: "Invalid email." }),
  role: z.enum(["admin", "member"], {
    error: "Please enter a role for this user.",
  }),
});

type FormType = z.infer<typeof formSchema>;

type InviteMemberModalProps = {
  open: boolean;
  setOpen: SetterType<boolean>;
  workspaceId: string;
};

export const InviteMemberModal = ({
  open,
  setOpen,
  workspaceId,
}: InviteMemberModalProps) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const handleInviteMember = async ({ email, role }: FormType) => {
    await authClient.organization.inviteMember(
      {
        email,
        role,
        resend: true,
        organizationId: workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Invite sent successfully!");
          setOpen(false);
        },
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Something went wrong. Please try again or come back later.",
          );
        },
      },
    );
  };

  return (
    <ResponsiveDialog
      title="Invite Member"
      description="Invite a new member to join your workspace"
      open={open}
      onChange={setOpen}
      dialogClassName="max-w-100 sm:max-w-100"
    >
      <form
        onSubmit={form.handleSubmit(handleInviteMember)}
        className="space-y-4"
      >
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input {...field} placeholder="example@email.com" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="role"
          control={form.control}
          render={({ field: { value, onChange, ...props }, fieldState }) => (
            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select value={value} onValueChange={onChange} {...props}>
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Select a role for this new user..." />
                </SelectTrigger>
                <SelectContent>
                  {["member", "admin"].map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button className="w-full">Send Invite</Button>
      </form>
    </ResponsiveDialog>
  );
};
