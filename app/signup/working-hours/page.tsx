import type { Metadata } from "next";
import { WorkingHoursScreen } from "@/components/Auth/WorkingHoursScreen";

export const metadata: Metadata = {
  title: "Set working hours | MedQT",
};

export default function WorkingHoursPage() {
  return <WorkingHoursScreen />;
}
