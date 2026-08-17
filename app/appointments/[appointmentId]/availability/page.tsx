import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppointmentEditScreen } from "@/components/Appointments/AppointmentEditScreen";
import { getAppointmentById } from "@/components/Appointments/appointments";

type AppointmentAvailabilityPageProps = {
  params: Promise<{ appointmentId: string }>;
};

export async function generateMetadata({ params }: AppointmentAvailabilityPageProps): Promise<Metadata> {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  return {
    title: appointment ? `${appointment.name} Availability | MedQT` : "Appointment not found | MedQT",
  };
}

export default async function AppointmentAvailabilityPage({ params }: AppointmentAvailabilityPageProps) {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  if (!appointment) notFound();

  return <AppointmentEditScreen activeSection="secondary-availability" appointment={appointment} />;
}
