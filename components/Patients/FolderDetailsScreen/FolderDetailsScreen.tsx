"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { PrimaryNavigation } from "@/components/Navigation";
import { Tag } from "@/components/Tag";
import { UploadDocumentModal } from "@/components/Patients/UploadDocumentModal";
import type { PatientDetailsData } from "@/components/Patients/PatientDetailsScreen";
import {
  patientRecordFolders,
  type PatientRecordSource,
} from "@/components/Patients/patientRecords";
import styles from "./FolderDetailsScreen.module.css";

type FolderDetailsScreenProps = {
  patient: PatientDetailsData;
  scope: {
    id: string;
    name: string;
    sources: PatientRecordSource[];
  };
};

type ContentTab = "insights" | "raw";

function sourceTypeForFile(file: File): PatientRecordSource["type"] {
  if (file.type.startsWith("image/")) return "Image";
  if (file.type === "application/pdf") return "PDF";
  return "Text";
}

function rawSourceLines(source: PatientRecordSource, patient: PatientDetailsData) {
  if (source.rawText) {
    return source.rawText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  }
  if (!source.rawData) return [];

  const references = source.referencedBy?.join(", ");
  const extractedRows = Object.entries(source.rawData).map(
    ([label, value]) => `${label.padEnd(20)} ${value}`,
  );

  return [
    "MEDQT PATIENT RECORD",
    `${(source.category ?? `${source.type} source`).toUpperCase()} • ${source.folderName}`,
    `PATIENT: ${patient.name}`,
    `DOB: ${patient.dateOfBirth}  ID: ${patient.id.toUpperCase()}`,
    references ? `REF. BY: ${references}` : "REF. BY: Not provided",
    `DATE CREATED: ${source.createdAt}`,
    `DATE UPDATED: ${source.updatedAt}`,
    `${source.type.toUpperCase()} SOURCE DATA  FIELD                VALUE`,
    "────────────────────────────────────────────────",
    ...extractedRows,
    "────────────────────────────────────────────────",
    `STATUS: ${source.status}`,
    `ACCESS LEVEL: ${source.accessLevel}`,
    `VERSION: ${source.version}`,
  ];
}

function findingItems(findings: string[] = []) {
  return findings.flatMap((finding) =>
    finding.split(/\n|•/).map((item) => item.trim()).filter(Boolean),
  );
}

function downloadSource(source: PatientRecordSource) {
  if (!source.file) return;

  const url = URL.createObjectURL(source.file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = source.file.name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function MetadataRow({ accent = false, label, value }: { accent?: boolean; label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className={`${styles.metadataRow} ${accent ? styles.metadataAccent : ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function FolderDetailsScreen({ patient, scope }: FolderDetailsScreenProps) {
  const [sources, setSources] = useState(scope.sources);
  const [selectedSourceId, setSelectedSourceId] = useState(scope.sources[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<ContentTab>(
    scope.sources[0]?.aiInsights?.length ? "insights" : "raw",
  );
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const selectedSource = useMemo(
    () => sources.find((source) => source.id === selectedSourceId) ?? sources[0],
    [selectedSourceId, sources],
  );

  const chooseSource = (source: PatientRecordSource) => {
    setSelectedSourceId(source.id);
    setActiveTab(source.aiInsights?.length ? "insights" : "raw");
  };

  const scopeLinks = [
    { href: `/patients/${patient.id}/records/all`, id: "all", label: "All Sources" },
    { href: `/patients/${patient.id}/records/unfiled`, id: "unfiled", label: "Unfiled" },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <PrimaryNavigation activeId="patients" fullHeight />
        </aside>

        <section className={styles.workspace}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/patients">
              <span className={styles.usersIcon}>
                <Image alt="" height={14} src="/icons/patients/details/users-four.svg" width={14} />
              </span>
              <span>Patients</span>
            </Link>
            <Image alt="" height={14} src="/icons/patients/details/caret-right.svg" width={14} />
            <Link href={`/patients/${patient.id}`}>
              <span className={styles.userIcon}>
                <Image alt="" height={13} src="/icons/patients/details/user-circle.svg" width={13} />
              </span>
              <span>{patient.name} - Patient profile</span>
            </Link>
            <Image alt="" height={14} src="/icons/patients/details/caret-right.svg" width={14} />
            <span aria-current="page" className={styles.currentCrumb}>
              <Image alt="" height={22} src="/icons/patients/details/folder.svg" width={23} />
              <span>{scope.name}</span>
            </span>
          </nav>

          <header className={styles.folderHeader}>
            <div className={styles.folderHeading}>
              <span>Patient record</span>
              <h1>{scope.name}</h1>
            </div>
            <div className={styles.headerActions}>
              <nav aria-label="Source collections" className={styles.scopeLinks}>
                {scopeLinks.map((item) => (
                  <Link
                    aria-current={scope.id === item.id ? "page" : undefined}
                    className={scope.id === item.id ? styles.scopeActive : ""}
                    href={item.href}
                    key={item.id}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Button leadingIcon onClick={() => setIsUploadOpen(true)} variant="primary">
                Add Source
              </Button>
            </div>
          </header>

          <div className={styles.detailsLayout}>
            <aside className={styles.sourceList}>
              <div className={styles.sourceListHeader}>
                <h2>Documents</h2>
              </div>
              <div className={styles.sourceDivider} />
              {sources.length ? (
                <div className={styles.sourceCards}>
                  {sources.map((source) => (
                    <button
                      aria-pressed={selectedSource?.id === source.id}
                      className={`${styles.sourceCard} ${selectedSource?.id === source.id ? styles.sourceSelected : ""}`}
                      key={source.id}
                      onClick={() => chooseSource(source)}
                      type="button"
                    >
                      <span className={styles.sourceIcon}>
                        <Image alt="" height={21} src="/icons/patients/details/file-text.svg" width={21} />
                        {source.aiInsights?.length ? <span className={styles.aiMarker}>✦</span> : null}
                      </span>
                      <span className={styles.sourceCopy}>
                        <strong title={source.title}>{source.title}</strong>
                        <span>{source.createdAt}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={styles.emptySources}>
                  <strong>No sources here</strong>
                  <span>Add a source or choose All Sources.</span>
                </div>
              )}
            </aside>

            {selectedSource ? (
              <div className={styles.documentSurface}>
                <article className={styles.documentContent}>
                  <div aria-label="Document view" className={styles.tabs} role="tablist">
                    {selectedSource.aiInsights?.length ? (
                      <button
                        aria-selected={activeTab === "insights"}
                        className={activeTab === "insights" ? styles.tabActive : ""}
                        onClick={() => setActiveTab("insights")}
                        role="tab"
                        type="button"
                      >
                        AI Insights
                      </button>
                    ) : null}
                    {selectedSource.rawData ? (
                      <button
                        aria-selected={activeTab === "raw"}
                        className={activeTab === "raw" ? styles.tabActive : ""}
                        onClick={() => setActiveTab("raw")}
                        role="tab"
                        type="button"
                      >
                        Raw Data
                      </button>
                    ) : null}
                  </div>

                  {activeTab === "insights" && selectedSource.aiInsights?.length ? (
                    <div className={styles.insightContent}>
                      <section className={styles.patientSummary}>
                        <h2>Patient Details</h2>
                        <dl>
                          <div><dt>Full Name</dt><dd>{patient.name}</dd></div>
                          <div><dt>Patient MRN</dt><dd>{patient.id.toUpperCase()}</dd></div>
                          <div><dt>Date of Birth</dt><dd>{patient.dateOfBirth}</dd></div>
                        </dl>
                      </section>

                      <details className={styles.testResults}>
                        <summary>
                          <span>Test Results ({String(Object.keys(selectedSource.rawData ?? {}).length).padStart(2, "0")})</span>
                          <span aria-hidden className={styles.resultCaret} />
                        </summary>
                        <dl>
                          {Object.entries(selectedSource.rawData ?? {}).map(([label, value]) => (
                            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                          ))}
                        </dl>
                      </details>

                      <section className={styles.insightSection}>
                        <div className={styles.sectionHeading}>
                          <h2>Recommendations</h2>
                          <Tag className={styles.aiGeneratedTag} label="AI Generated" type="color" />
                        </div>
                        <div className={styles.insightRows}>
                          {selectedSource.aiInsights.map((insight) => (
                            <p key={insight}><span aria-hidden>i</span>{insight}</p>
                          ))}
                          <div className={styles.disclaimerRow}>
                            <span aria-hidden>!</span>
                            <div>
                              <strong>Medical Disclaimer</strong>
                              <p>These AI-generated insights are informational only. Verify the source and consult the appropriate care professional before making medical decisions.</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className={styles.notesSection}>
                        <span>Notes</span>
                        <p>{selectedSource.notes ?? "No notes have been added to this source."}</p>
                      </section>
                    </div>
                  ) : selectedSource.rawData ? (
                    <div className={styles.rawContent}>
                      <section className={styles.rawFileCard}>
                        <span aria-hidden className={styles.pdfBadge} data-type={selectedSource.type}>
                          {selectedSource.type === "Image" ? "IMG" : selectedSource.type === "Text" ? "TXT" : "PDF"}
                        </span>
                        <span className={styles.rawFileCopy}>
                          <strong>{selectedSource.title}</strong>
                          <span>{selectedSource.fileSize ?? `${selectedSource.type} source`}</span>
                        </span>
                        <button
                          aria-label={`Download ${selectedSource.title}`}
                          className={styles.downloadButton}
                          disabled={!selectedSource.file}
                          onClick={() => downloadSource(selectedSource)}
                          title={selectedSource.file ? "Download source" : "Original file is not available locally"}
                          type="button"
                        >
                          <span aria-hidden />
                        </button>
                      </section>
                      <div className={styles.rawViewer}>
                        {rawSourceLines(selectedSource, patient).map((line, index) => (
                          <p key={`${line}-${index}`}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyContent}>No extracted content is available for this source.</div>
                  )}
                </article>

                <aside className={styles.metadataPanel}>
                  <header className={styles.metadataHeader}>
                    <span>{selectedSource.category ?? `${selectedSource.type} source`}</span>
                    <h2>{selectedSource.title}</h2>
                  </header>
                  <details className={styles.metadataDetails} open>
                    <summary>
                      <span>Show Document Information</span>
                      <span aria-hidden className={styles.metadataCaret} />
                    </summary>
                    <div className={styles.metadataInfo}>
                      <h3>General Information</h3>
                      <dl>
                        <MetadataRow label="Date Created" value={selectedSource.createdAt} />
                        <MetadataRow label="Last Updated" value={selectedSource.updatedAt} />
                        <MetadataRow label="Ref. by" value={selectedSource.referencedBy?.join(", ")} />
                        <MetadataRow accent label="Category" value={selectedSource.category ?? selectedSource.type} />
                        <MetadataRow label="Saved In" value={selectedSource.folderName} />
                      </dl>
                      {selectedSource.findings?.length ? (
                        <div className={styles.keyFindings}>
                          <span>Key Findings</span>
                          <ul>{findingItems(selectedSource.findings).map((finding) => <li key={finding}>{finding}</li>)}</ul>
                        </div>
                      ) : null}
                    </div>
                  </details>
                </aside>
              </div>
            ) : (
              <div className={styles.emptyWorkspace}>
                <strong>No document selected</strong>
                <span>Add a source to this collection to see its content and metadata.</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <UploadDocumentModal
        defaultRecord={scope.id === "all" ? "Unfiled" : scope.name}
        existingRecords={["Unfiled", ...patientRecordFolders.map((folder) => folder.name)]}
        isOpen={isUploadOpen}
        onAddDocuments={(files, recordName) => {
          const today = new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date());
          const selectedFolder = patientRecordFolders.find((folder) => folder.name === recordName);
          const destinationFolderId = selectedFolder?.id
            ?? (scope.id === "all" || scope.id === "unfiled" || recordName === "Unfiled" ? null : scope.id);
          const destinationFolderName = selectedFolder?.name
            ?? (recordName || (scope.id === "all" ? "Unfiled" : scope.name));
          const addedSources = files.map<PatientRecordSource>((file, index) => ({
            accessLevel: "Contributor",
            createdAt: today,
            folderId: destinationFolderId,
            folderName: destinationFolderName,
            id: `uploaded-${Date.now()}-${index}`,
            file,
            fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            rawData: {
              "File name": file.name,
              "File size": `${Math.max(1, Math.round(file.size / 1024))} KB`,
              "Source format": sourceTypeForFile(file),
            },
            status: "Processing",
            title: file.name,
            type: sourceTypeForFile(file),
            updatedAt: today,
            version: "1.0",
          }));
          setSources((current) => [...current, ...addedSources]);
          if (addedSources[0]) chooseSource(addedSources[0]);
        }}
        onClose={() => setIsUploadOpen(false)}
      />
    </main>
  );
}
