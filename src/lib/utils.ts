import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COLOR_COMBINATIONS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSlug = (text: string, uniqueIdentifier?: string) => {
  if (!text.trim()) return "";
  return (
    text.toLowerCase().replaceAll(/\s+/g, "-") +
    (uniqueIdentifier ? `-${uniqueIdentifier}` : "")
  );
};

export const getColorCombination = (id: string) => {
  const charSum = id
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const colorIndex = charSum % COLOR_COMBINATIONS.length;
  return COLOR_COMBINATIONS[colorIndex];
};
