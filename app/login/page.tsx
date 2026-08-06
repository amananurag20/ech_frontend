import type { Metadata } from "next";
import { LoginScreen } from "@/components/Auth/LoginScreen";

export const metadata: Metadata = {
  title: "Log in | MedQT",
};

export default function LoginPage() {
  return <LoginScreen />;
}
