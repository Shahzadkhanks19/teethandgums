const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS",
  "NEXT_PUBLIC_CLIENT_URL",
  "SOCKET_SERVER_URL",
  "SOCKET_SECRET",
  "NEXT_PUBLIC_SOCKET_SERVER_URL",
  "CRON_SECRET",
] as const;

const MIN_SECRET_LENGTH = 32;

let validated = false;

export function validateEnv(): void {
  if (validated) return;

  const missingVars = requiredEnvVars.filter(
    (key) => !process.env[key]?.trim(),
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missingVars.join(", ")}`,
    );
  }

  const secretVariables = [
    "JWT_SECRET",
    "SOCKET_SECRET",
    "CRON_SECRET",
  ] as const;

  for (const key of secretVariables) {
    const value = process.env[key];

    if (value && value.length < MIN_SECRET_LENGTH) {
      throw new Error(
        `${key} must be at least ${MIN_SECRET_LENGTH} characters long`,
      );
    }
  }

  try {
    new URL(process.env.NEXT_PUBLIC_CLIENT_URL as string);
    new URL(process.env.SOCKET_SERVER_URL as string);
    new URL(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL as string);
  } catch {
    throw new Error(
      "Client and socket environment variables must be valid absolute URLs",
    );
  }

  validated = true;
}
