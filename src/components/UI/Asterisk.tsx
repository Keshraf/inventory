import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";

type Props = {
  className?: ClassValue;
};

const Asterisk = ({ className }: Props) => {
  return <div className={cn("text-red-500 inline mx-1", className)}>*</div>;
};

export default Asterisk;
