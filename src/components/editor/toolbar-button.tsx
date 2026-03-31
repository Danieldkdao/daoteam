import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const ToolbarButton = ({
  children,
  className,
  disabled,
  isActive = false,
  label,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  label: string;
  onClick: () => void;
}) => {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={isActive ? "secondary" : "ghost"}
      className={cn("shrink-0", className)}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
