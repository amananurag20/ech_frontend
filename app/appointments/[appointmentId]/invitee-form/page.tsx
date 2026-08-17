import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppointmentEditScreen } from "@/components/Appointments/AppointmentEditScreen";
import { getAppointmentById } from "@/components/Appointments/appointments";

type AppointmentInviteeFormPageProps = {
  params: Promise<{ appointmentId: string }>;
};

export async function generateMetadata({ params }: AppointmentInviteeFormPageProps): Promise<Metadata> {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  return {
    title: appointment ? `${appointment.name} Invitee Form | MedQT` : "Appointment not found | MedQT",
  };
}

export default async function AppointmentInviteeFormPage({ params }: AppointmentInviteeFormPageProps) {
  const { appointmentId } = await params;
  const appointment = getAppointmentById(appointmentId);

  if (!appointment) notFound();

  return <AppointmentEditScreen activeSection="invitee-form" appointment={appointment} />;
}
