import { servicesData } from "@/data/services";

export const appointmentServices = servicesData.map((service) => ({
  slug: service.slug,
  title: service.title,
}));

export const morningSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
];

export const eveningSlots = [
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
];

export const heroPoints = [
  "Instant Online Booking",
  "Experienced Dental Surgeons",
  "Quick Appointment Confirmation",
];

export const trustStats = [
  {
    icon: "fa-solid fa-user-doctor",
    title: "Experienced Dental Surgeons",
  },
  {
    icon: "fa-solid fa-shield-heart",
    title: "Safe & Sterile Environment",
  },
  {
    icon: "fa-solid fa-calendar-check",
    title: "Easy Online Booking",
  },
];

export const clinicFeatures = [
  {
    icon: "fa-solid fa-user-doctor",
    title: "Experienced Dental Surgeons",
    text: "Receive personalized treatment from experienced dental surgeons committed to providing high-quality oral healthcare.",
  },
  {
    icon: "fa-solid fa-tooth",
    title: "Advanced Dental Technology",
    text: "Modern dental equipment ensures accurate diagnosis, comfortable procedures and better treatment outcomes.",
  },
  {
    icon: "fa-solid fa-shield-heart",
    title: "Safe & Sterile Clinic",
    text: "Strict sterilization protocols and patient-first care ensure a safe, hygienic and comfortable dental experience.",
  },
  {
    icon: "fa-solid fa-calendar-check",
    title: "Easy Appointment Scheduling",
    text: "Book your preferred dentist, date and appointment time online with real-time slot availability.",
  },
];

export const nextSteps = [
  "Submit Your Appointment Request",
  "Clinic Reviews Availability",
  "Receive Appointment Confirmation",
  "Visit Teeth and Gums Care",
];

export const doctors = [
  {
    name: "Dr. Sunita Khetani",
    qualification: "BDS",
    role: "Dental Surgeon",
    image: "/images/common/sunita.webp",
    experience: "Experienced Dental Surgeon",
    patients: "Personalized Patient Care",
    specialties: [
      "General & Family Dentistry",
      "Cosmetic Dentistry",
      "Preventive Dentistry",
    ],
    languages: ["Hindi", "English"],
    status: "Available for Consultation",
    registration: "",
    experienceYears: "",
    location: "Jodhpur, Rajasthan",
  },
  {
    name: "Dr. Vishal Khetani",
    qualification: "BDS",
    role: "Dental Surgeon",
    image: "/images/common/vishal.webp",
    experience: "Experienced Dental Surgeon",
    patients: "Advanced Dental Treatments",
    specialties: [
      "Restorative Dentistry",
      "Root Canal Treatment",
      "Dental Implant Treatment",
    ],
    languages: ["Hindi", "English"],
    status: "Available for Consultation",
    registration: "",
    experienceYears: "",
    location: "Jodhpur, Rajasthan",
  },
];

export const appointmentFaqs = [
  {
    id: "reschedule",
    question: "Can I reschedule my appointment?",
    answer:
      "Yes. If your preferred appointment time is unavailable, you can contact Teeth and Gums Care to reschedule your appointment based on slot availability.",
  },
  {
    id: "reports",
    question: "Do I need to bring previous dental reports?",
    answer:
      "Please bring any previous dental prescriptions, X-rays or treatment reports so our dentists can better understand your oral health condition.",
  },
  {
    id: "late",
    question: "What if I am late for my appointment?",
    answer:
      "If you are running late, please call the clinic as soon as possible. Our team will try to accommodate your appointment depending on availability.",
  },
  {
    id: "emergency",
    question: "Can I book an emergency appointment?",
    answer:
      "Yes. For severe tooth pain, swelling, broken teeth, bleeding or dental trauma, contact Teeth and Gums Care immediately for emergency dental assistance.",
  },
  {
    id: "duration",
    question: "How long does a dental consultation take?",
    answer:
      "A routine dental consultation usually takes around 30 to 45 minutes depending on your dental condition and recommended treatment.",
  },
];