import type { Metadata } from "next";
import { PatientsScreen } from "@/components/Patients/PatientsScreen";

export const metadata: Metadata = {
  title: "Patients | MedQT",
};

type PageProps = {
  searchParams: Promise<{ empty?: string }>;
};

export default async function PatientsPage({ searchParams }: PageProps) {
  const { empty } = await searchParams;
  return <PatientsScreen patients={empty === "1" ? [] : undefined} />;
}
