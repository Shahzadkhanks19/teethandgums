"use client";

import type { ComponentProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faArrowRight,
  faCalendarCheck,
  faCheck,
  faChevronDown,
  faCircleInfo,
  faHeart,
  faHeartCircleCheck,
  faMicroscope,
  faNotesMedical,
  faPhone,
  faShieldHeart,
  faTooth,
  faTriangleExclamation,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";

const iconMap: Record<string, IconDefinition> = {
  "fa-arrow-left": faArrowLeft,
  "fa-arrow-right": faArrowRight,
  "fa-calendar-check": faCalendarCheck,
  "fa-check": faCheck,
  "fa-chevron-down": faChevronDown,
  "fa-circle-info": faCircleInfo,
  "fa-heart": faHeart,
  "fa-heart-circle-check": faHeartCircleCheck,
  "fa-microscope": faMicroscope,
  "fa-notes-medical": faNotesMedical,
  "fa-phone": faPhone,
  "fa-shield-heart": faShieldHeart,
  "fa-tooth": faTooth,
  "fa-triangle-exclamation": faTriangleExclamation,
  "fa-user-doctor": faUserDoctor,
};

type ServiceIconProps = Omit<ComponentProps<typeof FontAwesomeIcon>, "icon"> & {
  className?: string;
};

export default function ServiceIcon({
  className = "",
  ...props
}: ServiceIconProps) {
  const tokens = className.split(/\s+/).filter(Boolean);
  const iconToken = tokens.find(
    (token) =>
      token.startsWith("fa-") &&
      !["fa-solid", "fa-regular", "fa-brands", "fa-spin"].includes(token),
  );

  const icon = iconMap[iconToken ?? ""] ?? faTooth;

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
      className={cleanClassName || undefined}
      {...props}
    />
  );
}
