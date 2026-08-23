"use client";

import { m, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <m.div
      key={pathname}
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.18, delay: 0.32 }}
      className="pointer-events-none fixed left-0 top-0 z-[999999] h-[3px] w-full overflow-hidden"
    >
      <m.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.34, ease: "easeOut" }}
        className="h-full rounded-r-full bg-blue-600"
      />
    </m.div>
  );
}
