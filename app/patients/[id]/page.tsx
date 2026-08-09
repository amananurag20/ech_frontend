import type { Metadata } from "next";
import { PatientDetailsScreen, type PatientDetailsData } from "@/components/Patients/PatientDetailsScreen";

export const metadata: Metadata = {
  title: "Patient Profile | MedQT",
};

const defaultPatient: PatientDetailsData = {
  name: "Jerard De Santa",
  contact: "(404) 5812-312",
  email: "jdsanta412@mail.com",
  gender: "Male",
  dateOfBirth: "Nov 4th, 1997",
  country: "USA",
  emergencyContact: "(404) 2100-212",
};

const namesById: Record<string, Pick<PatientDetailsData, "name" | "gender">> = {
  "g-1": { name: "Sarah Johnson", gender: "Female" },
  "g-2": { name: "Jose Merinez", gender: "Male" },
  "g-3": { name: "Sarah Johnson", gender: "Female" },
  "g-4": { name: "Jerard De Santa", gender: "Male" },
  "g-5": { name: "Tilly Jenae", gender: "Female" },
  "g-6": { name: "Sarah Johnson", gender: "Female" },
  "g-7": { name: "Odona Seikwa", gender: "Female" },
  "p-1": { name: "Sarah Johnson", gender: "Female" },
  "p-2": { name: "Sarah Johnson", gender: "Female" },
  "p-3": { name: "Sarah Johnson", gender: "Female" },
  "p-4": { name: "Sarah Johnson", gender: "Female" },
};

export function generateStaticParams() {
  return Object.keys(namesById).map((id) => ({ id }));
}

export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const identity = namesById[id] ?? { name: defaultPatient.name, gender: defaultPatient.gender };

  return <PatientDetailsScreen patient={{ ...defaultPatient, ...identity }} />;
}
