"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { adminFetch } from "@/lib/adminFetch";

import {
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminTableStates";

import AdminIcon from "@/components/admin/AdminIcon";
type Settings = {
  clinicName: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  address: string;
  googleMapsUrl: string;
  workingHours: string;

  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  adminNotificationEmail: string;

  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;

  primaryColor: string;
  secondaryColor: string;
  emailFooter: string;

  appointmentEmailsEnabled: boolean;
  contactEmailsEnabled: boolean;
  reminderEmailsEnabled: boolean;
  adminNotificationsEnabled: boolean;
};



type AdminProfileResponse = {
  success?: boolean;
  message?: string;
  admin?: {
    id: string;
    email: string;
  };
};

type SettingsApiResponse = {
  success?: boolean;
  message?: string;
  settings?: Partial<Settings>;
};

type AdminActionResponse = {
  success?: boolean;
  message?: string;
  admin?: {
    id: string;
    email: string;
  };
};

const defaultSettings: Settings = {
  clinicName: "Teeth and Gums Care",
  logoUrl: "",
  phone: "",
  whatsapp: "",
  address: "",
  googleMapsUrl: "",
  workingHours: "",

  senderName: "Teeth and Gums Care",
  senderEmail: "",
  replyToEmail: "",
  adminNotificationEmail: "",

  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPassword: "",
  smtpSecure: false,

  primaryColor: "#2563eb",
  secondaryColor: "#172554",
  emailFooter: "Teeth and Gums Care, Jodhpur",

  appointmentEmailsEnabled: true,
  contactEmailsEnabled: true,
  reminderEmailsEnabled: true,
  adminNotificationsEnabled: true,
};

export default function SettingsClient() {
  const [adminEmail, setAdminEmail] = useState("");
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [emailData, setEmailData] = useState({
    newEmail: "",
    currentPassword: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [testEmail, setTestEmail] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [adminRes, settingsRes] = await Promise.all([
        adminFetch("/api/admin/me"),
        adminFetch("/api/admin/settings"),
      ]);

      const [adminData, settingsData] = (await Promise.all([
        adminRes.json().catch(() => null),
        settingsRes.json().catch(() => null),
      ])) as [
        AdminProfileResponse | null,
        SettingsApiResponse | null,
      ];

      if (!adminRes.ok || !adminData?.success) {
        throw new Error(adminData?.message || "Failed to load admin profile");
      }

      if (!settingsRes.ok || !settingsData?.success) {
        throw new Error(settingsData?.message || "Failed to load settings");
      }

      const admin = adminData.admin;

      if (!admin?.email) {
        throw new Error("Admin profile email was not returned");
      }

      setAdminEmail(admin.email);
      setEmailData((prev) => ({
        ...prev,
        newEmail: admin.email,
      }));

      setSettings({
        ...defaultSettings,
        ...(settingsData.settings || {}),
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load settings";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => {
            void fetchSettings();
          }, { timeout: 900 })
        : globalThis.setTimeout(() => {
            void fetchSettings();
          }, 120);

    return () => {
      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId as number);
      }
    };
  }, [fetchSettings]);

  const updateSettings = async () => {
    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = (await response.json().catch(() => null)) as
        | SettingsApiResponse
        | null;

      if (!response.ok || !data?.success) {
        toast.error(data?.message || "Failed to update settings");
        return;
      }

      setSettings({
        ...defaultSettings,
        ...data.settings,
      });

      toast.success("Settings updated successfully");
    } catch {
      toast.error("Server error while updating settings");
    } finally {
      setActionLoading(false);
    }
  };

  const changeLoginEmail = async () => {
    if (!emailData.newEmail || !emailData.currentPassword) {
      toast.error("New email and current password are required");
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/change-email", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const data = (await response.json().catch(() => null)) as
        | AdminActionResponse
        | null;

      if (!response.ok || !data?.success) {
        toast.error(data?.message || "Failed to update login email");
        return;
      }

      const updatedAdmin = data.admin;

      if (!updatedAdmin?.email) {
        toast.error("Updated admin email was not returned");
        return;
      }

      setAdminEmail(updatedAdmin.email);
      localStorage.setItem("adminEmail", updatedAdmin.email);

      setEmailData({
        newEmail: updatedAdmin.email,
        currentPassword: "",
      });

      toast.success("Login email updated successfully");
    } catch {
      toast.error("Server error while updating login email");
    } finally {
      setActionLoading(false);
    }
  };

  const changePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      const data = (await response.json().catch(() => null)) as
        | AdminActionResponse
        | null;

      if (!response.ok || !data?.success) {
        toast.error(data?.message || "Failed to change password");
        return;
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully");
    } catch {
      toast.error("Server error while changing password");
    } finally {
      setActionLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error("Enter a test email address");
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testEmail }),
      });

      const data = (await response.json().catch(() => null)) as
        | AdminActionResponse
        | null;

      if (!response.ok || !data?.success) {
        toast.error(data?.message || "Failed to send test email");
        return;
      }

      toast.success("Test email sent successfully");
    } catch {
      toast.error("Server error while sending test email");
    } finally {
      setActionLoading(false);
    }
  };

  const updateField = (field: keyof Settings, value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) return <AdminLoadingState text="Loading settings..." />;
  if (error) return <AdminErrorState text={error} onRetry={fetchSettings} />;

  return (
    <div className="space-y-7">
      <section aria-labelledby="admin-settings-title" className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
        <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
          Settings Center
        </span>

        <h1 id="admin-settings-title" className="mt-4 text-3xl font-black text-slate-900">
          Admin & Clinic Settings
        </h1>

        <p className="mt-2 max-w-3xl leading-7 text-slate-500">
          Manage clinic information, admin login email, SMTP, sender email,
          notification settings, branding and password security.
        </p>
      </section>

      <section className="[content-visibility:auto] [contain-intrinsic-size:2400px] grid gap-7 xl:grid-cols-2">
        <SettingsCard title="Clinic Information" icon="fa-solid fa-hospital">
          <Input label="Clinic Name" value={settings.clinicName} onChange={(v) => updateField("clinicName", v)} />
          <Input label="Logo URL" value={settings.logoUrl} onChange={(v) => updateField("logoUrl", v)} />
          <Input label="Phone" value={settings.phone} onChange={(v) => updateField("phone", v)} />
          <Input label="WhatsApp" value={settings.whatsapp} onChange={(v) => updateField("whatsapp", v)} />
          <Input label="Address" value={settings.address} onChange={(v) => updateField("address", v)} />
          <Input label="Google Maps URL" value={settings.googleMapsUrl} onChange={(v) => updateField("googleMapsUrl", v)} />
          <Textarea label="Working Hours" value={settings.workingHours} onChange={(v) => updateField("workingHours", v)} />
        </SettingsCard>

        <SettingsCard title="Email Configuration" icon="fa-solid fa-envelope-circle-check">
          <Input label="Sender Name" value={settings.senderName} onChange={(v) => updateField("senderName", v)} />
          <Input label="Sender Email" value={settings.senderEmail} onChange={(v) => updateField("senderEmail", v)} />
          <Input label="Reply-To Email" value={settings.replyToEmail} onChange={(v) => updateField("replyToEmail", v)} />
          <Input label="Admin Notification Email" value={settings.adminNotificationEmail} onChange={(v) => updateField("adminNotificationEmail", v)} />
          <Input label="SMTP Host" value={settings.smtpHost} onChange={(v) => updateField("smtpHost", v)} />
          <Input label="SMTP Port" type="number" value={String(settings.smtpPort)} onChange={(v) => updateField("smtpPort", Number(v))} />
          <Input label="SMTP Username" value={settings.smtpUser} onChange={(v) => updateField("smtpUser", v)} />
          <Input label="SMTP Password" type="password" value={settings.smtpPassword} onChange={(v) => updateField("smtpPassword", v)} />

          <Toggle
            label="Use Secure SMTP"
            checked={settings.smtpSecure}
            onChange={(v) => updateField("smtpSecure", v)}
          />

          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
            <Input label="Send Test Email To" value={testEmail} onChange={setTestEmail} />

            <button
              type="button"
              disabled={actionLoading}
              onClick={sendTestEmail}
              className="mt-4 w-full rounded-2xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              Send Test Email
            </button>
          </div>
        </SettingsCard>
      </section>

      <section className="[content-visibility:auto] [contain-intrinsic-size:2600px] grid gap-7 xl:grid-cols-2">
        <SettingsCard title="Admin Login Email" icon="fa-solid fa-user-shield">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="text-sm font-bold text-slate-500">Current Login Email</p>
            <p className="mt-1 break-all text-xl font-black text-blue-700">
              {adminEmail}
            </p>
          </div>

          <Input
            label="New Login Email"
            value={emailData.newEmail}
            onChange={(v) => setEmailData((p) => ({ ...p, newEmail: v }))}
          />

          <Input
            label="Current Password"
            type="password"
            value={emailData.currentPassword}
            onChange={(v) => setEmailData((p) => ({ ...p, currentPassword: v }))}
          />

          <button
            type="button"
            disabled={actionLoading}
            onClick={changeLoginEmail}
            className="rounded-2xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            Change Login Email
          </button>
        </SettingsCard>

        <SettingsCard title="Change Password" icon="fa-solid fa-key">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-700">
            Password should include uppercase, lowercase, number and special
            character.
          </div>

          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(v) =>
              setPasswordData((p) => ({ ...p, currentPassword: v }))
            }
          />

          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(v) => setPasswordData((p) => ({ ...p, newPassword: v }))}
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(v) =>
              setPasswordData((p) => ({ ...p, confirmPassword: v }))
            }
          />

          <button
            type="button"
            disabled={actionLoading}
            onClick={changePassword}
            className="rounded-2xl bg-slate-900 px-6 py-3 font-black text-white transition hover:bg-black disabled:opacity-60"
          >
            Change Password
          </button>
        </SettingsCard>
      </section>

      <section className="grid gap-7 xl:grid-cols-2">
        <SettingsCard title="Branding" icon="fa-solid fa-palette">
          <Input label="Primary Color" type="color" value={settings.primaryColor} onChange={(v) => updateField("primaryColor", v)} />
          <Input label="Secondary Color" type="color" value={settings.secondaryColor} onChange={(v) => updateField("secondaryColor", v)} />
          <Textarea label="Email Footer" value={settings.emailFooter} onChange={(v) => updateField("emailFooter", v)} />
        </SettingsCard>

        <SettingsCard title="Notifications" icon="fa-solid fa-bell">
          <Toggle label="Appointment Emails" checked={settings.appointmentEmailsEnabled} onChange={(v) => updateField("appointmentEmailsEnabled", v)} />
          <Toggle label="Contact Emails" checked={settings.contactEmailsEnabled} onChange={(v) => updateField("contactEmailsEnabled", v)} />
          <Toggle label="Reminder Emails" checked={settings.reminderEmailsEnabled} onChange={(v) => updateField("reminderEmailsEnabled", v)} />
          <Toggle label="Admin Notifications" checked={settings.adminNotificationsEnabled} onChange={(v) => updateField("adminNotificationsEnabled", v)} />
        </SettingsCard>
      </section>

      <div className="sticky bottom-4 z-20 rounded-[24px] border border-blue-100 bg-white/95 p-4 shadow-[0_18px_55px_rgba(37,99,235,.18)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-slate-500">
            Save changes after editing clinic, email, branding or notification settings.
          </p>

          <button
            type="button"
            disabled={actionLoading}
            onClick={updateSettings}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-900 px-8 py-3 font-black text-white transition motion-safe:hover:-translate-y-1 disabled:opacity-60"
          >
            {actionLoading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
          <AdminIcon aria-hidden="true" className={icon} />
        </div>

        <h3 className="text-2xl font-black text-slate-900">{title}</h3>
      </div>

      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-blue-100 bg-blue-50/40 p-4 font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700">
        {label}
      </label>

      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-2xl border border-blue-100 bg-blue-50/40 p-4 font-bold leading-7 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/40 p-4 text-left"
    >
      <span className="font-black text-slate-700">{label}</span>

      <span
        className={`flex h-7 w-14 items-center rounded-full p-1 transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white transition ${
            checked ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}