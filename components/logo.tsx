import Image from "next/image";

/**
 * Logo Parameter. `variant`:
 * - "light" → wordmark putih (untuk background gelap)  [default]
 * - "dark"  → wordmark navy (untuk background cream)
 */
export function Logo({
  variant = "light",
  className,
  height = 30,
}: {
  variant?: "light" | "dark";
  className?: string;
  height?: number;
}) {
  const src =
    variant === "light" ? "/parameter-logo-white.png" : "/parameter-logo.png";
  return (
    <Image
      src={src}
      alt="Parameter"
      width={height * 6}
      height={height}
      style={{ height, width: "auto" }}
      className={className}
      priority
    />
  );
}
