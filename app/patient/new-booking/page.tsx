import type { Metadata } from "next";
import { PatientBookingScreen } from "@/components/Booking/PatientBookingScreen";

export const metadata: Metadata = {
  title: "Book an appointment | MedQT",
};

export default function NewPatientBookingPage() {
  return <PatientBookingScreen />;
}
