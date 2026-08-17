import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppointmentEditScreen } from "@/components/Appointments/AppointmentEditScreen";
import {
  getAppointmentById,
  initialAppointments,
} from "@/components/Appointments/appointments";

type AppointmentPageProps = {
  params: Promise<{ appointmentId: string }>;
};

export function generateStaticParams() {
  return initialAppointments.map((appointment) => ({
    appointmentId: appointment.id,
  }));
}

export async function generateMetadata({ params }: AppointmentPageProps): Promise<Metadata> {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  return {
    title: appointment ? `${appointment.name} | MedQT` : "Appointment not found | MedQT",
  };
}

export default async function AppointmentPage({ params }: AppointmentPageProps) {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  if (!appointment) notFound();

  return <AppointmentEditScreen appointment={appointment} />;
}
