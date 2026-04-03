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
    <div className="pt-10 px-10 w-full h-full flex gap-8">
      <SettingsLinks workspaceId={workspaceId} />
      <div className="flex-1 w-full h-full overflow-auto">{children}</div>
    </div>
  );
};

export default SettingsLayout;
