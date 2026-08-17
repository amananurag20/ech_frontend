export type AppointmentType = {
  duration: string;
  hidden?: boolean;
  id: string;
  name: string;
};

export const initialAppointments: AppointmentType[] = [
  { id: "routine", name: "Routine Visits", duration: "30m" },
  { id: "specialty", name: "Specialty Consultation", duration: "15m", hidden: true },
  { id: "follow-up", name: "Follow-up", duration: "10m" },
];

export function getAppointmentById(appointmentId: string) {
  return initialAppointments.find((appointment) => appointment.id === appointmentId);
}
