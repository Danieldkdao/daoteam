"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MainLayoutSidebarContextType = {
  mobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
};

const MainLayoutSidebarContext =
  createContext<MainLayoutSidebarContextType | null>(null);

export const useMainLayoutSidebar = () => {
  const context = useContext(MainLayoutSidebarContext);

  if (!context) {
    throw new Error(
      "Main layout sidebar state must be used inside the main layout shell.",
    );
  }

  return context;
};

export const MainLayoutShell = ({
  desktopSidebars,
  mobileSidebar,
  children,
}: {
  desktopSidebars: ReactNode;
  mobileSidebar: ReactNode;
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const currentPathname = pathname ?? "";
  const [mobileSidebarPath, setMobileSidebarPath] = useState<string | null>(
    null,
  );
  const mobileSidebarOpen =
    currentPathname !== "" && mobileSidebarPath === currentPathname;

  const isChannelRoute =
    currentPathname !== "" &&
    /^\/workspace\/[^/]+\/channel\/[^/]+/.test(currentPathname);

  const value = useMemo<MainLayoutSidebarContextType>(
    () => ({
      mobileSidebarOpen,
      openMobileSidebar: () =>
        setMobileSidebarPath(currentPathname === "" ? null : currentPathname),
      closeMobileSidebar: () => setMobileSidebarPath(null),
      toggleMobileSidebar: () =>
        setMobileSidebarPath((currentValue) =>
          currentValue === currentPathname ? null : currentPathname,
        ),
    }),
    [currentPathname, mobileSidebarOpen],
  );

  return (
    <MainLayoutSidebarContext.Provider value={value}>
      <Drawer
        direction="left"
        open={mobileSidebarOpen}
        onOpenChange={(open) =>
          setMobileSidebarPath(
            open && currentPathname !== "" ? currentPathname : null,
          )
        }
        shouldScaleBackground={false}
      >
        <div className="flex h-svh w-full overflow-hidden bg-background">
          <div className="hidden h-full shrink-0 xl:flex">{desktopSidebars}</div>
          <DrawerContent
            overlayClassName="xl:hidden"
            className={cn(
              "border-r bg-sidebar p-0 text-sidebar-foreground xl:hidden",
              "data-[vaul-drawer-direction=left]:w-[min(28rem,calc(100vw-0.75rem))]",
              "data-[vaul-drawer-direction=left]:rounded-r-2xl",
              "data-[vaul-drawer-direction=left]:sm:max-w-none",
            )}
          >
            <DrawerTitle className="sr-only">Workspace navigation</DrawerTitle>
            <div className="flex h-full min-h-0 flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    Navigation
                  </span>
                  <p className="text-base font-semibold">Workspace Menu</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMobileSidebarPath(null)}
                >
                  <XIcon />
                </Button>
              </div>
              <div className="flex min-h-0 flex-1 overflow-hidden">
                {mobileSidebar}
              </div>
            </div>
          </DrawerContent>
          <div className="flex min-w-0 flex-1 overflow-hidden">{children}</div>

          {!isChannelRoute && !mobileSidebarOpen ? (
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 top-4 z-20 shadow-sm xl:hidden"
              onClick={() =>
                setMobileSidebarPath(
                  currentPathname === "" ? null : currentPathname,
                )
              }
            >
              <MenuIcon />
            </Button>
          ) : null}
        </div>
      </Drawer>
    </MainLayoutSidebarContext.Provider>
  );
};
