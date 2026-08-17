import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppointmentEditScreen } from "@/components/Appointments/AppointmentEditScreen";
import { getAppointmentById } from "@/components/Appointments/appointments";

type AppointmentConfirmationPageProps = {
  params: Promise<{ appointmentId: string }>;
};

export async function generateMetadata({ params }: AppointmentConfirmationPageProps): Promise<Metadata> {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  return {
    title: appointment ? `${appointment.name} Confirmation | MedQT` : "Appointment not found | MedQT",
  };
}

export default async function AppointmentConfirmationPage({ params }: AppointmentConfirmationPageProps) {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  if (!appointment) notFound();

  return <AppointmentEditScreen activeSection="confirmation" appointment={appointment} />;
}
