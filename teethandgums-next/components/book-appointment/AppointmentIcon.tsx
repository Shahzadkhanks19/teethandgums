"use client";

import type { ComponentProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRight,
  faAward,
  faBriefcaseMedical,
  faCalendar,
  faCalendarCheck,
  faCalendarDay,
  faCalendarDays,
  faCalendarPlus,
  faCheck,
  faChevronDown,
  faCircle,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faClipboardCheck,
  faClock,
  faCommentMedical,
  faEnvelope,
  faFaceSmileBeam,
  faHeadset,
  faHeart,
  faHeartCircleCheck,
  faHospital,
  faHospitalUser,
  faHourglassHalf,
  faHouse,
  faLanguage,
  faLock,
  faMessage,
  faMoneyBillWave,
  faMoon,
  faNotesMedical,
  faPaperPlane,
  faPhone,
  faPhoneVolume,
  faShieldHeart,
  faSpinner,
  faStethoscope,
  faSun,
  faTooth,
  faTriangleExclamation,
  faUser,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCalendar as faRegularCalendar,
  faCircle as faRegularCircle,
  faClock as faRegularClock,
} from "@fortawesome/free-regular-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const iconMap: Record<string, IconDefinition> = {
  "fa-arrow-right": faArrowRight,
  "fa-award": faAward,
  "fa-briefcase-medical": faBriefcaseMedical,
  "fa-calendar": faCalendar,
  "fa-calendar-check": faCalendarCheck,
  "fa-calendar-day": faCalendarDay,
  "fa-calendar-days": faCalendarDays,
  "fa-calendar-plus": faCalendarPlus,
  "fa-check": faCheck,
  "fa-chevron-down": faChevronDown,
  "fa-circle": faCircle,
  "fa-circle-check": faCircleCheck,
  "fa-circle-exclamation": faCircleExclamation,
  "fa-circle-info": faCircleInfo,
  "fa-clipboard-check": faClipboardCheck,
  "fa-clock": faClock,
  "fa-comment-medical": faCommentMedical,
  "fa-envelope": faEnvelope,
  "fa-face-smile-beam": faFaceSmileBeam,
  "fa-headset": faHeadset,
  "fa-heart": faHeart,
  "fa-heart-circle-check": faHeartCircleCheck,
  "fa-hospital": faHospital,
  "fa-hospital-user": faHospitalUser,
  "fa-hourglass-half": faHourglassHalf,
  "fa-house": faHouse,
  "fa-language": faLanguage,
  "fa-lock": faLock,
  "fa-message": faMessage,
  "fa-money-bill-wave": faMoneyBillWave,
  "fa-moon": faMoon,
  "fa-notes-medical": faNotesMedical,
  "fa-paper-plane": faPaperPlane,
  "fa-phone": faPhone,
  "fa-phone-volume": faPhoneVolume,
  "fa-shield-heart": faShieldHeart,
  "fa-spinner": faSpinner,
  "fa-stethoscope": faStethoscope,
  "fa-sun": faSun,
  "fa-tooth": faTooth,
  "fa-triangle-exclamation": faTriangleExclamation,
  "fa-user": faUser,
  "fa-user-doctor": faUserDoctor,
  "fa-whatsapp": faWhatsapp,
};

type AppointmentIconProps = Omit<
  ComponentProps<typeof FontAwesomeIcon>,
  "icon"
> & {
  className?: string;
};

export default function AppointmentIcon({
  className = "",
  ...props
}: AppointmentIconProps) {
  const tokens = className.split(/\s+/).filter(Boolean);
  const iconToken = tokens.find(
    (token) =>
      token.startsWith("fa-") &&
      !["fa-solid", "fa-regular", "fa-brands", "fa-spin"].includes(token),
  );

  const isRegular = tokens.includes("fa-regular");
  const icon =
    iconToken === "fa-circle" && isRegular
      ? faRegularCircle
      : iconToken === "fa-clock" && isRegular
        ? faRegularClock
        : iconToken === "fa-calendar" && isRegular
          ? faRegularCalendar
          : iconMap[iconToken ?? ""] ?? faCircle;

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
