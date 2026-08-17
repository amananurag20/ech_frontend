import type { Metadata } from "next";
import { PatientDetailsScreen } from "@/components/Patients/PatientDetailsScreen";
import { getPatientDetails, patientIds } from "@/components/Patients/patientDirectory";

export const metadata: Metadata = {
  title: "Patient Profile | MedQT",
};

export function generateStaticParams() {
  return patientIds.map((id) => ({ id }));
}

export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PatientDetailsScreen patient={getPatientDetails(id)} />;
}
