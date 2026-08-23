"use client";

import type { ComponentProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowLeft,
  faBan,
  faBars,
  faBell,
  faBellSlash,
  faBolt,
  faCalendar,
  faCalendarCheck,
  faCalendarDays,
  faCalendarXmark,
  faChartLine,
  faCheck,
  faCheckDouble,
  faChevronDown,
  faCircle,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCircleXmark,
  faClock,
  faClockRotateLeft,
  faEllipsisVertical,
  faEnvelope,
  faGear,
  faLayerGroup,
  faMagnifyingGlass,
  faRightFromBracket,
  faRotate,
  faRotateRight,
  faSpinner,
  faTooth,
  faTrashCan,
  faTriangleExclamation,
  faUser,
  faUserDoctor,
  faUserShield,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCopy,
  faFolderOpen,
} from "@fortawesome/free-regular-svg-icons";

const iconMap: Record<string, IconDefinition> = {
  "fa-angles-left": faAnglesLeft,
  "fa-angles-right": faAnglesRight,
  "fa-arrow-left": faArrowLeft,
  "fa-ban": faBan,
  "fa-bars": faBars,
  "fa-bell": faBell,
  "fa-bell-slash": faBellSlash,
  "fa-bolt": faBolt,
  "fa-calendar": faCalendar,
  "fa-calendar-check": faCalendarCheck,
  "fa-calendar-days": faCalendarDays,
  "fa-calendar-xmark": faCalendarXmark,
  "fa-chart-line": faChartLine,
  "fa-check": faCheck,
  "fa-check-double": faCheckDouble,
  "fa-chevron-down": faChevronDown,
  "fa-circle": faCircle,
  "fa-circle-check": faCircleCheck,
  "fa-circle-exclamation": faCircleExclamation,
  "fa-circle-info": faCircleInfo,
  "fa-circle-xmark": faCircleXmark,
  "fa-clock": faClock,
  "fa-clock-rotate-left": faClockRotateLeft,
  "fa-copy": faCopy,
  "fa-ellipsis-vertical": faEllipsisVertical,
  "fa-envelope": faEnvelope,
  "fa-folder-open": faFolderOpen,
  "fa-gear": faGear,
  "fa-layer-group": faLayerGroup,
  "fa-magnifying-glass": faMagnifyingGlass,
  "fa-right-from-bracket": faRightFromBracket,
  "fa-rotate": faRotate,
  "fa-rotate-right": faRotateRight,
  "fa-spinner": faSpinner,
  "fa-tooth": faTooth,
  "fa-trash-can": faTrashCan,
  "fa-triangle-exclamation": faTriangleExclamation,
  "fa-user": faUser,
  "fa-user-doctor": faUserDoctor,
  "fa-user-shield": faUserShield,
  "fa-xmark": faXmark,
};

type AdminIconProps = Omit<ComponentProps<typeof FontAwesomeIcon>, "icon"> & {
  className?: string;
};

export default function AdminIcon({ className = "", ...props }: AdminIconProps) {
  const tokens = className.split(/\s+/).filter(Boolean);
  const iconToken = tokens.find(
    (token) =>
      token.startsWith("fa-") &&
      !["fa-solid", "fa-regular", "fa-brands", "fa-spin"].includes(token),
  );

  const icon = iconMap[iconToken ?? ""] ?? faCircle;

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
