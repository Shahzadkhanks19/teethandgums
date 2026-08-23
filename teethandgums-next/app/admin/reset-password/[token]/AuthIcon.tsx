"use client";

import type { ComponentProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faCheck,
  faCircleCheck,
  faCircleExclamation,
  faEnvelope,
  faEye,
  faEyeSlash,
  faKey,
  faLock,
  faMinus,
  faPaperPlane,
  faRightToBracket,
  faShieldHalved,
  faSpinner,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const iconMap: Record<string, IconDefinition> = {
  "fa-arrow-left": faArrowLeft,
  "fa-check": faCheck,
  "fa-circle-check": faCircleCheck,
  "fa-circle-exclamation": faCircleExclamation,
  "fa-envelope": faEnvelope,
  "fa-eye": faEye,
  "fa-eye-slash": faEyeSlash,
  "fa-key": faKey,
  "fa-lock": faLock,
  "fa-minus": faMinus,
  "fa-paper-plane": faPaperPlane,
  "fa-right-to-bracket": faRightToBracket,
  "fa-shield-halved": faShieldHalved,
  "fa-spinner": faSpinner,
  "fa-user-shield": faUserShield,
};

type AuthIconProps = Omit<ComponentProps<typeof FontAwesomeIcon>, "icon"> & {
  className?: string;
};

export default function AuthIcon({
  className = "",
  ...props
}: AuthIconProps) {
  const tokens = className.split(/\s+/).filter(Boolean);

  const iconToken = tokens.find(
    (token) =>
      token.startsWith("fa-") &&
      !["fa-solid", "fa-regular", "fa-brands", "fa-spin"].includes(token),
  );

  const icon = iconMap[iconToken ?? ""] ?? faLock;

  const cleanClassName = tokens
    .filter(
      (token) =>
        token !== iconToken &&
        !["fa-solid", "fa-regular", "fa-brands", "fa-spin"].includes(token),
    )
    .join(" ");

  return (
    <FontAwesomeIcon
      icon={icon}
      spin={tokens.includes("fa-spin")}
      className={cleanClassName || undefined}
      {...props}
    />
  );
}
