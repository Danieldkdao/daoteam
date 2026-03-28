import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSlug = (text: string, uniqueIdentifier?: string) => {
  return (
    text.toLowerCase().replaceAll(/\s+/g, "-") +
    (uniqueIdentifier ? `-${uniqueIdentifier}` : "")
  );
};
