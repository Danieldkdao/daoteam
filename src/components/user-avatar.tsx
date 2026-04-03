import { cn } from "@/lib/utils";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
  name: string;
  image: string | null | undefined;
  className?: string;
  textClassName?: string;
  isLive?: boolean;
  liveIndicatorClassName?: string;
};

export const UserAvatar = ({
  name,
  image,
  className,
  textClassName,
  isLive = false,
  liveIndicatorClassName,
}: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={image ?? undefined} alt={`${name}'s Profile Image`} />
      <AvatarFallback className={textClassName}>
        {name
          .split(" ")
          .map((part) => part[0].toUpperCase())
          .join("")}
      </AvatarFallback>
      {isLive ? (
        <AvatarBadge
          aria-label={`${name} is online`}
          className={cn("size-3.5 bg-emerald-500 ring-background", liveIndicatorClassName)}
          role="status"
        />
      ) : null}
    </Avatar>
  );
};
