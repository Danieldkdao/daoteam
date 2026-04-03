import { UnauthorizedState } from "@/components/unauthorized-state";
import { SettingsLinks } from "@/components/settings/settings-links";
import { getMemberOrgInfo } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const SettingsLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) => {
  const { workspaceId } = await params;
  const response = await getMemberOrgInfo(workspaceId);
  if (response === "NOAUTH") return redirect("/sign-in");
  if (response === "NOORG" || response === "NOMEMBER")
    return redirect("/workspace");
  if (response.member?.role !== "admin" && response.member?.role !== "owner")
    return (
      <UnauthorizedState description="Only workspace admins and owners can manage settings for this workspace." />
    );

  return (
    <div className="flex h-full w-full flex-col gap-6 px-4 pt-6 md:px-8 md:pt-8 lg:px-10 lg:pt-10">
      <SettingsLinks workspaceId={workspaceId} />
      <div className="min-h-0 flex-1 w-full overflow-auto">{children}</div>
    </div>
  );
};

export default SettingsLayout;
