"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const UserProfileSection = ({
  mobile = false,
}: {
  mobile?: boolean;
}) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  if (!session || isPending) return;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Sign out successful!");
          router.push("/sign-in");
        },
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Something went wrong. Please try again or come back later.",
          );
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={cn(
            "bg-card border rounded-lg flex items-center justify-center",
            mobile ? "size-11" : "w-full h-20 p-4",
          )}
        >
          <UserAvatar
            name={session.user.name}
            image={session.user.image}
            className={cn(mobile ? "size-9" : "size-11")}
            textClassName=""
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent alignOffset={70} onClick={handleSignOut}>
        <DropdownMenuItem className="text-destructive">
          <LogOutIcon className="text-destructive" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
