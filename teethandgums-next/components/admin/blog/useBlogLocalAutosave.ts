"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { BlogEditorValues } from "./BlogTypes";

type StoredBlogDraft = {
  values: BlogEditorValues;
  savedAt: string;
};

export default function useBlogLocalAutosave(
  key: string,
  values: BlogEditorValues,
  dirty: boolean,
) {
  const [storedDraft, setStoredDraft] =
    useState<StoredBlogDraft | null>(null);
  const [lastLocalSave, setLastLocalSave] =
    useState<string | null>(null);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      try {
        const raw = localStorage.getItem(key);

        if (!raw) return;

        const parsed = JSON.parse(raw) as StoredBlogDraft;

        if (parsed?.values && parsed?.savedAt) {
          setStoredDraft(parsed);
          setLastLocalSave(parsed.savedAt);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }, 0);

    return () => globalThis.clearTimeout(timeoutId);
  }, [key]);

  useEffect(() => {
    if (!dirty) return;

    const intervalId = globalThis.setInterval(() => {
      const payload: StoredBlogDraft = {
        values,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify(payload));
      setLastLocalSave(payload.savedAt);
    }, 30_000);

    return () => globalThis.clearInterval(intervalId);
  }, [dirty, key, values]);

  const clearStoredDraft = useCallback(() => {
    localStorage.removeItem(key);
    setStoredDraft(null);
    setLastLocalSave(null);
  }, [key]);

  return {
    storedDraft,
    lastLocalSave,
    clearStoredDraft,
    dismissStoredDraft: () => setStoredDraft(null),
  };
}
