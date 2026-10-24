import Image from "next/image";
import { cn } from "@/lib/utils";

const leaders = [
  ["/form/leader-1.jpg", 640, 800],
  ["/form/leader-2.jpg", 640, 800],
  ["/form/leader-3.jpg", 640, 800],
  ["/form/leader-4.jpg", 640, 800],
] as const;

export function FormLeaders({ className = "" }: { className?: string }) {
  return (
    <div className={cn("bg-white px-3 pt-4 pb-3 sm:px-6 sm:pt-5", className)}>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
        {leaders.map(([src, width, height]) => (
          <div key={src} className="bg-white p-px shadow-[0_0_0_1px_#1a1a1a] sm:p-1">
            <Image src={src} alt="" width={width} height={height} priority className="aspect-[4/5] w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
