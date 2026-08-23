type SocketEventName =
  | "newAppointment"
  | "appointmentUpdated"
  | "appointmentDeleted"
  | "newContactMessage"
  | "contactUpdated"
  | "contactDeleted"
  | "activityLogUpdated"
  | "availabilityUpdated";

type EmitSocketPayload = {
  eventName: SocketEventName;
  payload?: Record<string, unknown>;
};

const SOCKET_TIMEOUT_MS = 5_000;

export default async function emitSocketEvent({
  eventName,
  payload = {},
}: EmitSocketPayload): Promise<void> {
  const socketServerUrl = process.env.SOCKET_SERVER_URL;
  const socketSecret = process.env.SOCKET_SECRET;

  if (!socketServerUrl || !socketSecret) {
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    SOCKET_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      `${socketServerUrl.replace(/\/$/, "")}/emit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-socket-secret": socketSecret,
        },
        body: JSON.stringify({
          eventName,
          payload,
        }),
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      console.error(
        `Socket emit failed with status ${response.status}`,
      );
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Socket emit timed out");
      return;
    }

    console.error("Socket emit failed:", error);
  } finally {
    clearTimeout(timeoutId);
  }
}
