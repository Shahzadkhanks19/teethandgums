import xss from "xss";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue };

const forbiddenKeys = new Set([
  "__proto__",
  "constructor",
  "prototype",
]);

function sanitizeKey(key: string): string | null {
  if (forbiddenKeys.has(key)) {
    return null;
  }

  return key.replace(/[$.]/g, "_");
}

export function sanitizeInput<T extends JsonValue>(value: T): T {
  if (typeof value === "string") {
    return xss(value.trim()) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeInput(item)) as T;
  }

  if (value && typeof value === "object") {
    const clean: Record<string, JsonValue> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      const cleanKey = sanitizeKey(key);

      if (cleanKey === null) {
        continue;
      }

      clean[cleanKey] = sanitizeInput(nestedValue);
    }

    return clean as T;
  }

  return value;
}
