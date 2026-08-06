import type { Metadata } from "next";
import { SignupScreen } from "@/components/Auth/SignupScreen";

export const metadata: Metadata = {
  title: "Create an account | MedQT",
};

export default function SignupPage() {
  return <SignupScreen />;
}
