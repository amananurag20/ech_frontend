import type { Metadata } from "next";
import { ProfileSetupScreen } from "@/components/Auth/ProfileSetupScreen";

export const metadata: Metadata = {
  title: "Set up your account | MedQT",
};

export default function ProfileSetupPage() {
  return <ProfileSetupScreen />;
}
