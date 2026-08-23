"use client";

import { useReportWebVitals } from "next/web-vitals";

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      path: window.location.pathname,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics/web-vitals",
        new Blob([body], { type: "application/json" }),
      );
      return;
    }

    void fetch("/api/analytics/web-vitals", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => undefined);
  });

  return null;
}
