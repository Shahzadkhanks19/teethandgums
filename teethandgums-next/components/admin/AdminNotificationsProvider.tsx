"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import toast from "react-hot-toast";

import { adminFetch } from "@/lib/adminFetch";

export type AdminNotificationType = "appointment" | "contact";
export type AdminNotificationPriority = "normal" | "important";

export type AdminNotification = {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  referenceType: AdminNotificationType;
  referenceId: string;
  priority: AdminNotificationPriority;
  createdAt: string;
  updatedAt?: string;
  read: boolean;
};

export type RealtimeAdminNotification = {
  _id?: string;
  id?: string;
  type?: AdminNotificationType;
  title?: string;
  message?: string;
  referenceType?: AdminNotificationType;
  referenceId?: string | { toString(): string };
  priority?: AdminNotificationPriority;
  createdAt?: string;
  updatedAt?: string;
  isRead?: boolean;
  read?: boolean;
};

type NotificationsApiItem = {
  _id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  referenceType: AdminNotificationType;
  referenceId: string | { toString(): string };
  priority?: AdminNotificationPriority;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
};

type NotificationsApiResponse = {
  success: boolean;
  message?: string;
  unreadCount?: number;
  notifications?: NotificationsApiItem[];
};

type State = {
  notifications: AdminNotification[];
  loading: boolean;
  error: string;
  initialized: boolean;
};

type Action =
  | {
      type: "LOAD_START";
    }
  | {
      type: "LOAD_SUCCESS";
      payload: AdminNotification[];
    }
  | {
      type: "LOAD_ERROR";
      payload: string;
    }
  | {
      type: "ADD_OR_REPLACE";
      payload: AdminNotification;
    }
  | {
      type: "MARK_READ";
      payload: string;
    }
  | {
      type: "MARK_ALL_READ";
    }
  | {
      type: "DELETE";
      payload: string;
    }
  | {
      type: "CLEAR";
    };

type ContextValue = {
  notifications: AdminNotification[];
  unreadCount: number;
  loading: boolean;
  error: string;
  initialized: boolean;
  refreshNotifications: (silent?: boolean) => Promise<void>;
  addRealtimeNotification: (
    notification: RealtimeAdminNotification,
  ) => void;
  markRead: (notificationId: string) => Promise<boolean>;
  markAllRead: () => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  clearNotifications: () => Promise<boolean>;
};

const MAX_ITEMS = 100;

const initialState: State = {
  notifications: [],
  loading: true,
  error: "",
  initialized: false,
};

const AdminNotificationsContext =
  createContext<ContextValue | null>(null);

function normalizeReferenceId(
  referenceId: string | { toString(): string } | undefined,
) {
  if (!referenceId) return "";

  return typeof referenceId === "string"
    ? referenceId
    : referenceId.toString();
}

function normalizeApiNotification(
  item: NotificationsApiItem,
): AdminNotification {
  return {
    id: item._id,
    type: item.type,
    title: item.title,
    message: item.message,
    referenceType: item.referenceType,
    referenceId: normalizeReferenceId(item.referenceId),
    priority: item.priority || "normal",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    read: item.isRead,
  };
}

function normalizeRealtimeNotification(
  item: RealtimeAdminNotification,
): AdminNotification | null {
  const id = item._id || item.id;

  if (
    !id ||
    !item.type ||
    !item.title ||
    !item.message ||
    !item.referenceType
  ) {
    return null;
  }

  return {
    id,
    type: item.type,
    title: item.title,
    message: item.message,
    referenceType: item.referenceType,
    referenceId: normalizeReferenceId(item.referenceId),
    priority: item.priority || "normal",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt,
    read: item.isRead ?? item.read ?? false,
  };
}

function sortNewestFirst(
  notifications: AdminNotification[],
) {
  return [...notifications].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );
}

function mergeNotification(
  existingNotifications: AdminNotification[],
  incomingNotification: AdminNotification,
) {
  const existingIndex = existingNotifications.findIndex(
    (item) => item.id === incomingNotification.id,
  );

  if (existingIndex === -1) {
    return sortNewestFirst([
      incomingNotification,
      ...existingNotifications,
    ]).slice(0, MAX_ITEMS);
  }

  const updatedNotifications = [...existingNotifications];

  updatedNotifications[existingIndex] = {
    ...updatedNotifications[existingIndex],
    ...incomingNotification,
  };

  return sortNewestFirst(updatedNotifications).slice(
    0,
    MAX_ITEMS,
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        loading: true,
        error: "",
      };

    case "LOAD_SUCCESS":
      return {
        notifications: sortNewestFirst(action.payload).slice(
          0,
          MAX_ITEMS,
        ),
        loading: false,
        error: "",
        initialized: true,
      };

    case "LOAD_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        initialized: true,
      };

    case "ADD_OR_REPLACE":
      return {
        ...state,
        notifications: mergeNotification(
          state.notifications,
          action.payload,
        ),
      };

    case "MARK_READ":
      return {
        ...state,
        notifications: state.notifications.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                read: true,
              }
            : item,
        ),
      };

    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((item) => ({
          ...item,
          read: true,
        })),
      };

    case "DELETE":
      return {
        ...state,
        notifications: state.notifications.filter(
          (item) => item.id !== action.payload,
        ),
      };

    case "CLEAR":
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
}

export function AdminNotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const refreshNotifications = useCallback(
    async (silent = false) => {
      if (!silent) {
        dispatch({
          type: "LOAD_START",
        });
      }

      try {
        const response = await adminFetch(
          "/api/admin/notifications",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = (await response.json().catch(() => null)) as
          | NotificationsApiResponse
          | null;

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || "Failed to load notifications",
          );
        }

        const normalizedNotifications = (
          data.notifications || []
        ).map(normalizeApiNotification);

        dispatch({
          type: "LOAD_SUCCESS",
          payload: normalizedNotifications,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load notifications";

        dispatch({
          type: "LOAD_ERROR",
          payload: errorMessage,
        });

        if (!silent) {
          toast.error(errorMessage);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => {
            void refreshNotifications();
          }, { timeout: 1000 })
        : globalThis.setTimeout(() => {
            void refreshNotifications();
          }, 150);

    return () => {
      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId as number);
      }
    };
  }, [refreshNotifications]);

  useEffect(() => {
    const handleRealtimeConnected = () => {
      refreshNotifications(true);
    };

    window.addEventListener(
      "adminRealtimeConnected",
      handleRealtimeConnected,
    );

    return () => {
      window.removeEventListener(
        "adminRealtimeConnected",
        handleRealtimeConnected,
      );
    };
  }, [refreshNotifications]);

  const unreadCount = useMemo(
    () =>
      state.notifications.filter(
        (notification) => !notification.read,
      ).length,
    [state.notifications],
  );

  useEffect(() => {
    const cleanTitle = document.title.replace(
      /^\(\d+\)\s*/,
      "",
    );

    document.title =
      unreadCount > 0
        ? `(${unreadCount}) ${cleanTitle}`
        : cleanTitle;

    return () => {
      document.title = document.title.replace(
        /^\(\d+\)\s*/,
        "",
      );
    };
  }, [unreadCount]);

  const addRealtimeNotification = useCallback(
    (notification: RealtimeAdminNotification) => {
      const normalizedNotification =
        normalizeRealtimeNotification(notification);

      if (!normalizedNotification) {
        console.warn(
          "Invalid realtime notification payload:",
          notification,
        );

        refreshNotifications(true);
        return;
      }

      dispatch({
        type: "ADD_OR_REPLACE",
        payload: normalizedNotification,
      });
    },
    [refreshNotifications],
  );

  const markRead = useCallback(
    async (notificationId: string) => {
      const existingNotification =
        state.notifications.find(
          (item) => item.id === notificationId,
        );

      if (!existingNotification) {
        return false;
      }

      if (existingNotification.read) {
        return true;
      }

      dispatch({
        type: "MARK_READ",
        payload: notificationId,
      });

      try {
        const response = await adminFetch(
          `/api/admin/notifications/${notificationId}/read`,
          {
            method: "PATCH",
          },
        );

        const data = (await response.json().catch(() => null)) as
          | { success?: boolean; message?: string }
          | null;

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message ||
              "Failed to mark notification as read",
          );
        }

        return true;
      } catch (error) {
        await refreshNotifications(true);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read";

        toast.error(errorMessage);
        return false;
      }
    },
    [refreshNotifications, state.notifications],
  );

  const markAllRead = useCallback(async () => {
    const hasUnreadNotifications =
      state.notifications.some((item) => !item.read);

    if (!hasUnreadNotifications) {
      return true;
    }

    dispatch({
      type: "MARK_ALL_READ",
    });

    try {
      const response = await adminFetch(
        "/api/admin/notifications/read-all",
        {
          method: "PATCH",
        },
      );

      const data = (await response.json().catch(() => null)) as
          | { success?: boolean; message?: string }
          | null;

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Failed to mark all notifications as read",
        );
      }

      return true;
    } catch (error) {
      await refreshNotifications(true);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as read";

      toast.error(errorMessage);
      return false;
    }
  }, [refreshNotifications, state.notifications]);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      const existingNotification =
        state.notifications.find(
          (item) => item.id === notificationId,
        );

      if (!existingNotification) {
        return false;
      }

      dispatch({
        type: "DELETE",
        payload: notificationId,
      });

      try {
        const response = await adminFetch(
          `/api/admin/notifications/${notificationId}`,
          {
            method: "DELETE",
          },
        );

        const data = (await response.json().catch(() => null)) as
          | { success?: boolean; message?: string }
          | null;

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || "Failed to delete notification",
          );
        }

        return true;
      } catch (error) {
        await refreshNotifications(true);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to delete notification";

        toast.error(errorMessage);
        return false;
      }
    },
    [refreshNotifications, state.notifications],
  );

  const clearNotifications =
    useCallback(async () => {
      if (state.notifications.length === 0) {
        return true;
      }

      dispatch({
        type: "CLEAR",
      });

      try {
        const response = await adminFetch(
          "/api/admin/notifications/clear",
          {
            method: "DELETE",
          },
        );

        const data = (await response.json().catch(() => null)) as
          | { success?: boolean; message?: string }
          | null;

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message ||
              "Failed to clear notifications",
          );
        }

        return true;
      } catch (error) {
        await refreshNotifications(true);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to clear notifications";

        toast.error(errorMessage);
        return false;
      }
    }, [refreshNotifications, state.notifications.length]);

  const contextValue = useMemo<ContextValue>(
    () => ({
      notifications: state.notifications,
      unreadCount,
      loading: state.loading,
      error: state.error,
      initialized: state.initialized,
      refreshNotifications,
      addRealtimeNotification,
      markRead,
      markAllRead,
      deleteNotification,
      clearNotifications,
    }),
    [
      state.notifications,
      state.loading,
      state.error,
      state.initialized,
      unreadCount,
      refreshNotifications,
      addRealtimeNotification,
      markRead,
      markAllRead,
      deleteNotification,
      clearNotifications,
    ],
  );

  return (
    <AdminNotificationsContext.Provider
      value={contextValue}
    >
      {children}
    </AdminNotificationsContext.Provider>
  );
}

export function useAdminNotifications() {
  const context = useContext(
    AdminNotificationsContext,
  );

  if (!context) {
    throw new Error(
      "useAdminNotifications must be used inside AdminNotificationsProvider",
    );
  }

  return context;
}