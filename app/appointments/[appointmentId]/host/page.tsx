import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppointmentEditScreen } from "@/components/Appointments/AppointmentEditScreen";
import { getAppointmentById } from "@/components/Appointments/appointments";

type AppointmentHostPageProps = {
  params: Promise<{ appointmentId: string }>;
};

export async function generateMetadata({ params }: AppointmentHostPageProps): Promise<Metadata> {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  return {
    title: appointment ? `${appointment.name} Host | MedQT` : "Appointment not found | MedQT",
  };
}

export default async function AppointmentHostPage({ params }: AppointmentHostPageProps) {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  if (!appointment) notFound();

  return <AppointmentEditScreen activeSection="host" appointment={appointment} />;
}
