export type AppointmentFormData = {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  doctor: string;
  message: string;
};

export type AppointmentErrors = Partial<AppointmentFormData> & {
  slot?: string;
};

export const initialAppointmentFormData: AppointmentFormData = {
  name: "",
  phone: "",
  email: "",
  service: "",
  date: "",
  doctor: "",
  message: "",
};