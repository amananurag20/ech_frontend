import type { Metadata } from "next";
import { PatientBookingDateScreen } from "@/components/Booking/PatientBookingDateScreen";

export const metadata: Metadata = {
  title: "Select appointment date | MedQT",
};

export default function PatientBookingDatePage() {
  return <PatientBookingDateScreen />;
}
