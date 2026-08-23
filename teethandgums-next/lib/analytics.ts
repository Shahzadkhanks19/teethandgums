"use client";

type AnalyticsValue = string | number | boolean | undefined;

type AnalyticsPayload = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  parameters: AnalyticsPayload = {},
) {
  if (typeof window === "undefined") return;

  const cleanParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined),
  );

  window.gtag?.("event", eventName, cleanParameters);

  window.dispatchEvent(
    new CustomEvent("site-analytics", {
      detail: {
        eventName,
        parameters: cleanParameters,
      },
    }),
  );
}
