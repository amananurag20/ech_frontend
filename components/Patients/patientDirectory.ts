import type { PatientDetailsData } from "@/components/Patients/PatientDetailsScreen";

const defaultPatient: Omit<PatientDetailsData, "id"> = {
  contact: "(404) 5812-312",
  country: "USA",
  dateOfBirth: "Nov 4th, 1997",
  email: "jdsanta412@mail.com",
  emergencyContact: "(404) 2100-212",
  gender: "Male",
  name: "Jerard De Santa",
};

export const patientIds = [
  "g-1", "g-2", "g-3", "g-4", "g-5", "g-6", "g-7",
  "p-1", "p-2", "p-3", "p-4",
] as const;

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

export function getPatientDetails(id: string): PatientDetailsData {
  const identity = namesById[id] ?? {
    gender: defaultPatient.gender,
    name: defaultPatient.name,
  };

  return { ...defaultPatient, ...identity, id };
}
