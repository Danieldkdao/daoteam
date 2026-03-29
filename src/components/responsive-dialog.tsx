"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

type ResponsiveDialogProps = {
  title: string;
  description?: string;
  open: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  dialogClassName?: string;
  drawerClassName?: string;
  children: ReactNode;
};

export const ResponsiveDialog = ({
  title,
  description,
  open,
  onChange,
  children,
  dialogClassName,
  drawerClassName,
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onChange}>
        <DrawerContent className={drawerClassName}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[80vh] overflow-y-auto px-5 pb-6">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent
        className={cn(
          "sm:max-w-2xl max-h-150 overflow-y-auto",
          dialogClassName,
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
