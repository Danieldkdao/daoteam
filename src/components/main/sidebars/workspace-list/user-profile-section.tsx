import { UserAvatar } from "@/components/user-avatar";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const UserProfileSection = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return (
    <div className="w-full h-20 p-4 bg-card border rounded-lg flex items-center justify-center">
      <UserAvatar
        name={session.user.name}
        image={session.user.image}
        className="size-11"
        textClassName=""
      />
    </div>
  );
};
