import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges tailwind classes, Prevents Conflicts and Purges unused classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
