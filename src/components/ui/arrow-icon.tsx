import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group flex size-full cursor-pointer items-center justify-center",
        className,
      )}
    >
      <div className="relative grid cursor-pointer items-center justify-center">
        <ChevronRight className="transition-all duration-500 ease-out group-hover:translate-x-0.5" />
        <div className="absolute right-[9px] h-[2px] w-3 origin-right scale-x-0 rounded-[1px] bg-current transition-all duration-300 ease-out group-hover:right-[7px] group-hover:scale-x-100" />
      </div>
    </div>
  );
}
