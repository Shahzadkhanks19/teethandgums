import { emailLayout } from "./layout";

export type ResetPasswordEmailData = {
  resetUrl: string;
};

export function adminResetPasswordEmail(
  data: ResetPasswordEmailData,
): string {
  return emailLayout({
    title: "Reset Your Password",
    previewText:
      "Password reset request for your Teeth and Gums Care admin account.",
    badge: "Security Alert",
    badgeTone: "red",
    heading: "Reset your administrator password",
    greeting: "Hello Administrator,",
    heroIcon: "🔒",
    heroTone: "red",
    body:
      "We received a request to reset your administrator password for the Teeth and Gums Care dashboard.\n\nIf you requested this password reset, click the button below to continue.\n\nIf you did not request this, you can safely ignore this email. Your account will remain secure.",
    infoTitle: "Security Information",
    infoItems: [
      {
        label: "Request Type",
        value: "Administrator Password Reset",
        icon: "🔐",
      },
      {
        label: "Validity",
        value: "Reset link expires automatically",
        icon: "⏳",
      },
    ],
    boxes: [
      {
        title: "Important Security Notice",
        tone: "red",
        content:
          "Never share this email or password reset link with anyone. Teeth and Gums Care staff will never ask you for your password.",
      },
    ],
    primaryButton: {
      label: "Reset Password",
      url: data.resetUrl,
      variant: "red",
    },
    showContactButtons: false,
    footerNote:
      "If you continue receiving password reset emails that you did not request, please change your password immediately and contact your system administrator.",
  });
}
