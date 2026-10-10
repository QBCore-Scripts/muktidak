import Image from "next/image";

export function Mark({ className = "h-12 w-12", priority = false, src = "" }: { className?: string; priority?: boolean; src?: string }) {
  const logo = src || "/logo.png";
  return (
    <Image
      src={logo}
      alt=""
      width={1024}
      height={1024}
      priority={priority}
      unoptimized={logo.startsWith("/api/")}
      className={`${className} object-contain`}
      aria-hidden
    />
  );
}
