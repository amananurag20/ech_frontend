import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FolderDetailsScreen } from "@/components/Patients/FolderDetailsScreen";
import { getPatientDetails, patientIds } from "@/components/Patients/patientDirectory";
import {
  getPatientRecordScope,
  patientRecordFolders,
} from "@/components/Patients/patientRecords";

type FolderDetailsPageProps = {
  params: Promise<{ folderId: string; id: string }>;
};

export function generateStaticParams() {
  const folderIds = ["all", "unfiled", ...patientRecordFolders.map((folder) => folder.id)];

  return patientIds.flatMap((id) => folderIds.map((folderId) => ({ folderId, id })));
}

export async function generateMetadata({ params }: FolderDetailsPageProps): Promise<Metadata> {
  const { folderId } = await params;
  const scope = getPatientRecordScope(folderId);

  return {
    title: scope ? `${scope.name} | MedQT` : "Patient Record | MedQT",
  };
}

export default async function FolderDetailsPage({ params }: FolderDetailsPageProps) {
  const { folderId, id } = await params;
  const scope = getPatientRecordScope(folderId);

  if (!scope) notFound();

  return <FolderDetailsScreen key={scope.id} patient={getPatientDetails(id)} scope={scope} />;
}
