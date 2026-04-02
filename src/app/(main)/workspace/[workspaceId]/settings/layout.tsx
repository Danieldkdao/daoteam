import { SettingsLinks } from "@/components/settings/settings-links";
import { ReactNode } from "react";

const SettingsLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) => {
  const { workspaceId } = await params;
  return (
    <div className="pt-10 px-10 w-full h-full flex gap-4">
      <SettingsLinks workspaceId={workspaceId} />
      <div className="flex-1 w-full h-full overflow-auto">{children}</div>
    </div>
  );
};

export default SettingsLayout;
