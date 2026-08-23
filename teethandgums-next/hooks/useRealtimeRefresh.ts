"use client";

import { useEffect, useRef } from "react";

type RealtimeRefreshCallback = () => void | Promise<void>;

export default function useRealtimeRefresh(
  callback: RealtimeRefreshCallback,
) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const rerunRequestedRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const runRefresh = async () => {
      if (isRunningRef.current) {
        rerunRequestedRef.current = true;
        return;
      }

      isRunningRef.current = true;

      try {
        await callbackRef.current();
      } catch (error) {
        console.error("Realtime refresh failed:", error);
      } finally {
        isRunningRef.current = false;

        if (rerunRequestedRef.current) {
          rerunRequestedRef.current = false;
          void runRefresh();
        }
      }
    };

    const handleRealtimeUpdate = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        void runRefresh();
      });
    };

    window.addEventListener(
      "adminRealtimeUpdate",
      handleRealtimeUpdate,
    );

    return () => {
      window.removeEventListener(
        "adminRealtimeUpdate",
        handleRealtimeUpdate,
      );

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = null;
      rerunRequestedRef.current = false;
    };
  }, []);
}
