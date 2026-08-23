"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import toast from "react-hot-toast";

import {
  type RealtimeAdminNotification,
  useAdminNotifications,
} from "@/components/admin/AdminNotificationsProvider";

type AppointmentPayload = {
  appointment?: {
    _id?: string;
    name?: string;
    service?: string;
    doctor?: string;
    date?: string;
    timeSlot?: string;
  };
  notification?: RealtimeAdminNotification | null;
  emittedAt?: string;
};

type ContactPayload = {
  contact?: {
    _id?: string;
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
  };
  notification?: RealtimeAdminNotification | null;
  emittedAt?: string;
};

type SocketTokenResponse = {
  success?: boolean;
  message?: string;
  socketToken?: string;
};

export default function AdminRealtime() {
  const socketRef = useRef<Socket | null>(null);
  const reconnectToastShownRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mountedRef = useRef(true);

  const {
    addRealtimeNotification,
    refreshNotifications,
  } = useAdminNotifications();

  useEffect(() => {
    mountedRef.current = true;

    const audio = new Audio("/sounds/notification.mp3");
    audio.preload = "none";
    audio.volume = 0.55;

    audioRef.current = audio;

    return () => {
      mountedRef.current = false;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

    if (!socketUrl) {
      console.warn(
        "NEXT_PUBLIC_SOCKET_SERVER_URL is missing",
      );

      return;
    }

    const playSound = () => {
      const audio = audioRef.current;

      if (!audio) return;

      audio.currentTime = 0;

      audio.play().catch(() => {
        // Browsers may block audio until the user has interacted with the page.
      });
    };

    const refreshDashboard = () => {
      window.dispatchEvent(
        new Event("adminRealtimeUpdate"),
      );
    };

    const showBrowserNotification = (
      title: string,
      body: string,
    ) => {
      if (!("Notification" in window)) {
        return;
      }

      const createNotification = () => {
        try {
          new Notification(title, {
            body,
            icon: "/favicon.ico",
            tag: `${title}-${Date.now()}`,
          });
        } catch {
          // Ignore browsers that reject notification creation.
        }
      };

      if (Notification.permission === "granted") {
        createNotification();
        return;
      }

      if (Notification.permission === "default") {
        Notification.requestPermission()
          .then((permission) => {
            if (
              permission === "granted" &&
              mountedRef.current
            ) {
              createNotification();
            }
          })
          .catch(() => {
            // Ignore notification permission errors.
          });
      }
    };

    const insertOrRefreshNotification = async (
      notification:
        | RealtimeAdminNotification
        | null
        | undefined,
    ) => {
      if (notification) {
        addRealtimeNotification(notification);
        return;
      }

      await refreshNotifications(true);
    };

    const connectSocket = async () => {
      try {
        const response = await fetch(
          "/api/admin/socket-token",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = (await response.json().catch(() => null)) as
          | SocketTokenResponse
          | null;

        if (
          !response.ok ||
          !data?.success ||
          !data?.socketToken
        ) {
          console.warn(
            data?.message ||
              "Socket token unavailable",
          );

          return;
        }

        if (!isMounted) {
          return;
        }

        const existingSocket = socketRef.current;

        if (existingSocket) {
          existingSocket.removeAllListeners();
          existingSocket.disconnect();
        }

        const socket = io(socketUrl, {
          auth: {
            token: data.socketToken,
          },
          transports: ["polling", "websocket"],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 8000,
          timeout: 12000,
          autoConnect: true,
        });

        socketRef.current = socket;

        socket.on("connect", async () => {
          reconnectToastShownRef.current = false;

          window.dispatchEvent(
            new Event("adminRealtimeConnected"),
          );

          await refreshNotifications(true);
        });

        socket.on("disconnect", () => {
          window.dispatchEvent(
            new Event("adminRealtimeDisconnected"),
          );
        });

        socket.on("reconnect_attempt", () => {
          if (reconnectToastShownRef.current) {
            return;
          }

          reconnectToastShownRef.current = true;

          toast.loading(
            "Reconnecting realtime updates...",
            {
              id: "admin-realtime-reconnect",
            },
          );
        });

        socket.io.on("reconnect", async () => {
          reconnectToastShownRef.current = false;

          toast.success(
            "Realtime updates restored",
            {
              id: "admin-realtime-reconnect",
            },
          );

          await refreshNotifications(true);

          refreshDashboard();
        });

        socket.on(
          "newAppointment",
          async (payload: AppointmentPayload) => {
            const appointment = payload.appointment;

            await insertOrRefreshNotification(
              payload.notification,
            );

            const patient =
              appointment?.name || "New Patient";

            const service =
              appointment?.service ||
              "Dental Appointment";

            const doctor =
              appointment?.doctor ||
              "Clinic Doctor";

            toast.success(
              `New appointment from ${patient}`,
              {
                id: `appointment-${
                  appointment?._id || Date.now()
                }`,
                duration: 6000,
              },
            );

            showBrowserNotification(
              "New Appointment",
              `${patient} booked ${service} with ${doctor}`,
            );

            playSound();

            refreshDashboard();
          },
        );

        socket.on(
          "newContactMessage",
          async (payload: ContactPayload) => {
            const contact = payload.contact;

            await insertOrRefreshNotification(
              payload.notification,
            );

            const name =
              contact?.name || "New Contact";

            toast.success(
              `New contact message from ${name}`,
              {
                id: `contact-${
                  contact?._id || Date.now()
                }`,
                duration: 6000,
              },
            );

            showBrowserNotification(
              "New Contact Message",
              `${name} submitted a contact enquiry`,
            );

            playSound();

            refreshDashboard();
          },
        );

        socket.on(
          "appointmentUpdated",
          async () => {
            await refreshNotifications(true);

            toast.success(
              "Appointment updated",
            );

            refreshDashboard();
          },
        );

        socket.on(
          "appointmentDeleted",
          async () => {
            await refreshNotifications(true);

            toast.success(
              "Appointment deleted",
            );

            refreshDashboard();
          },
        );

        socket.on(
          "contactUpdated",
          async () => {
            await refreshNotifications(true);

            toast.success(
              "Contact updated",
            );

            refreshDashboard();
          },
        );

        socket.on(
          "contactDeleted",
          async () => {
            await refreshNotifications(true);

            toast.success(
              "Contact deleted",
            );

            refreshDashboard();
          },
        );

        socket.on(
          "activityLogUpdated",
          refreshDashboard,
        );

        socket.on(
          "availabilityUpdated",
          refreshDashboard,
        );

        socket.on(
          "connect_error",
          (error) => {
            console.warn(
              "Realtime connection issue:",
              error.message,
            );
          },
        );
      } catch (error) {
        console.warn(
          "Socket setup failed:",
          error,
        );

        toast.error(
          "Unable to establish realtime connection.",
          {
            id: "admin-realtime-connect-error",
          },
        );
      }
    };

    connectSocket();

    return () => {
      isMounted = false;

      const socket = socketRef.current;

      if (socket) {
        socket.removeAllListeners();

        socket.disconnect();

        socketRef.current = null;
      }

      toast.dismiss("admin-realtime-reconnect");
      toast.dismiss("admin-realtime-connect-error");
    };
  }, [
    addRealtimeNotification,
    refreshNotifications,
  ]);

  return null;
}