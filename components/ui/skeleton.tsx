import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-[pulse_2.4s_ease-in-out_infinite] rounded-md bg-forest/8", className)}
      {...props}
    />
  )
}

export { Skeleton }
