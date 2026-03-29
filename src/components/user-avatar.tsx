import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
  name: string;
  image: string | null | undefined;
  className?: string;
  textClassName?: string;
};

export const UserAvatar = ({
  name,
  image,
  className,
  textClassName,
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
    </Avatar>
  );
};
