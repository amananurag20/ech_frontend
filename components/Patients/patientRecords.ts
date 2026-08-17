export type PatientRecordSource = {
  accessLevel: string;
  aiInsights?: string[];
  category?: string;
  createdAt: string;
  findings?: string[];
  file?: File;
  fileSize?: string;
  folderId: string | null;
  folderName: string;
  id: string;
  notes?: string;
  products?: string[];
  rawData?: Record<string, string>;
  rawText?: string;
  referencedBy?: string[];
  status: "Processed" | "Processing" | "Needs review";
  testResults?: PatientTestResult[];
  title: string;
  type: "Image" | "PDF" | "Text";
  updatedAt: string;
  version: string;
};

export type PatientTestResult = {
  fields: Array<{
    label: string;
    value: string;
  }>;
  status?: "High" | "Low" | "Normal";
  title: string;
  trend?: "down" | "neutral" | "up";
};

export type PatientRecordFolder = {
  id: string;
  name: string;
  sources: PatientRecordSource[];
};

const renalFolderName =
  "Aakashbhai Chaudhary - Renal Doppler Ultrasound (Kidneys and renal Arteries)";
const weeklyFolderName = "Weekly Report TKA-902231";

export const patientRecordFolders: PatientRecordFolder[] = [
  {
    id: "renal-doppler-ultrasound",
    name: renalFolderName,
    sources: [
      {
        accessLevel: "Contributor",
        aiInsights: [
          "This document has been indexed and attached to the patient record.",
          "Review the original source before using extracted information in a care decision.",
        ],
        category: "Lab report",
        createdAt: "July 19, 2026",
        findings: [
          "Elevated LDL Cholestrol (118 mg/dL)",
          "Elevated fasting glucose (102 mg/dL)",
          "Elevated HbA1c (6.2%) - indicates prediabetes",
        ],
        folderId: "renal-doppler-ultrasound",
        folderName: renalFolderName,
        id: "renal-doppler-report",
        notes: "Review the uploaded source and confirm the extracted fields before using this record.",
        products: ["MedQT Care"],
        rawData: {
          "Document title": renalFolderName,
          "Record date": "July 19, 2026",
          "Referenced by": "Dr. Sarah Downey, Dr. Jane Foster",
          "Source format": "PDF",
        },
        referencedBy: ["Dr. Sarah Downey", "Dr. Jane Foster"],
        status: "Processed",
        testResults: [
          {
            fields: [
              { label: "Route", value: "Oral" },
              { label: "Strength", value: "200 mg" },
              { label: "Frequency", value: "Twice a Day" },
            ],
            title: "Tab. Flasyl 200 (IV)",
            trend: "up",
          },
          {
            fields: [
              { label: "Result", value: "118 mg/dL" },
              { label: "Reference", value: "<100" },
            ],
            status: "High",
            title: "LDL Cholestrol",
            trend: "up",
          },
          {
            fields: [
              { label: "Result", value: "45 mg/dL" },
              { label: "Reference", value: ">40" },
            ],
            status: "Low",
            title: "HDL Cholestrol",
            trend: "neutral",
          },
          {
            fields: [
              { label: "Result", value: "134 mg/dL" },
              { label: "Reference", value: ">40" },
            ],
            status: "Normal",
            title: "Triglycerides",
            trend: "down",
          },
          {
            fields: [
              { label: "Result", value: "118 mg/dL" },
              { label: "Reference", value: "<100" },
            ],
            status: "High",
            title: "Glucose (Fasting)",
            trend: "up",
          },
          {
            fields: [
              { label: "Result", value: "6.2%" },
              { label: "Reference", value: "<5.7" },
            ],
            status: "High",
            title: "Hemoglobin A1C",
            trend: "up",
          },
          {
            fields: [
              { label: "Result", value: "7.2 10³/µL" },
              { label: "Reference", value: "4.2 - 5.4" },
            ],
            status: "Normal",
            title: "White Blood Cell",
            trend: "neutral",
          },
        ],
        title: renalFolderName,
        type: "PDF",
        updatedAt: "July 19, 2026",
        version: "1.0",
      },
      {
        accessLevel: "Contributor",
        aiInsights: [
          "The supporting image is attached to the same patient record.",
          "Compare this source with the primary report during review.",
        ],
        category: "Supporting image",
        createdAt: "July 19, 2026",
        findings: ["Supporting image indexed successfully"],
        folderId: "renal-doppler-ultrasound",
        folderName: renalFolderName,
        id: "renal-doppler-source-image",
        notes: "Supporting image supplied with the original patient record.",
        rawData: {
          "Document title": "Renal Doppler Ultrasound - Source Image.png",
          "Record date": "July 19, 2026",
          "Source format": "Image",
        },
        status: "Processed",
        title: "Renal Doppler Ultrasound - Source Image.png",
        type: "Image",
        updatedAt: "July 19, 2026",
        version: "1.0",
      },
      {
        accessLevel: "Contributor",
        aiInsights: [
          "This referral note is linked to the selected record folder.",
          "The original note remains the source of truth for its contents.",
        ],
        category: "Clinical note",
        createdAt: "July 18, 2026",
        folderId: "renal-doppler-ultrasound",
        folderName: renalFolderName,
        id: "renal-doppler-referral-note",
        notes: "Referral note associated with the uploaded report.",
        rawData: {
          "Document title": "Renal Doppler Ultrasound - Referral Note.txt",
          "Record date": "July 18, 2026",
          "Source format": "Text",
        },
        status: "Processed",
        title: "Renal Doppler Ultrasound - Referral Note.txt",
        type: "Text",
        updatedAt: "July 19, 2026",
        version: "1.0",
      },
      {
        accessLevel: "Contributor",
        aiInsights: [
          "This review summary was generated from the documents in this folder.",
          "Validate the summary against each linked source before sharing it.",
        ],
        category: "Review summary",
        createdAt: "July 20, 2026",
        findings: ["Review summary is linked to three supporting sources"],
        folderId: "renal-doppler-ultrasound",
        folderName: renalFolderName,
        id: "renal-doppler-review-summary",
        notes: "Summary prepared for record review.",
        rawData: {
          "Document title": "Renal Doppler Ultrasound - Review Summary.pdf",
          "Record date": "July 20, 2026",
          "Source format": "PDF",
        },
        status: "Needs review",
        title: "Renal Doppler Ultrasound - Review Summary.pdf",
        type: "PDF",
        updatedAt: "July 20, 2026",
        version: "1.0",
      },
    ],
  },
  {
    id: "weekly-report-tka-902231",
    name: weeklyFolderName,
    sources: [
      {
        accessLevel: "Contributor",
        category: "Weekly report",
        createdAt: "November 11, 2026",
        folderId: "weekly-report-tka-902231",
        folderName: weeklyFolderName,
        id: "weekly-report-document",
        rawData: {
          "Document title": weeklyFolderName,
          "Record date": "November 11, 2026",
          "Source format": "PDF",
        },
        status: "Processed",
        title: weeklyFolderName,
        type: "PDF",
        updatedAt: "November 11, 2026",
        version: "1.0",
      },
    ],
  },
];

export const allPatientRecordSources = patientRecordFolders.flatMap(
  (folder) => folder.sources,
);

export function getPatientRecordScope(folderId: string) {
  if (folderId === "all") {
    return { id: "all", name: "All Sources", sources: allPatientRecordSources };
  }

  if (folderId === "unfiled") {
    return {
      id: "unfiled",
      name: "Unfiled",
      sources: allPatientRecordSources.filter((source) => source.folderId === null),
    };
  }

  return patientRecordFolders.find((folder) => folder.id === folderId);
}
