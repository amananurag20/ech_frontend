import type { Metadata } from "next";
import { PatientBookingConfirmationScreen } from "@/components/Booking/PatientBookingConfirmationScreen";

export const metadata: Metadata = {
  title: "Appointment scheduled | MedQT",
};

type PageProps = {
  searchParams: Promise<{ date?: string; timeIndex?: string }>;
};

export default async function PatientBookingConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <PatientBookingConfirmationScreen date={params.date} timeIndex={params.timeIndex} />;
}
