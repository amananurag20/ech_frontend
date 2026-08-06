import type { Metadata } from "next";
import { AppointmentsScreen } from "@/components/Appointments/AppointmentsScreen";

export const metadata: Metadata = {
  title: "Appointments | MedQT",
};

type PageProps = {
  searchParams: Promise<{ empty?: string }>;
};

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const { empty } = await searchParams;
  return <AppointmentsScreen appointments={empty === "1" ? [] : undefined} />;
}
