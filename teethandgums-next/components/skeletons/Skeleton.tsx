import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export default function Skeleton({
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={`motion-safe:animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 ${className}`}
    />
  );
}
