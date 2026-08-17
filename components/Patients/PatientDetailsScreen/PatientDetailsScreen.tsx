"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/Button";
import { PrimaryNavigation } from "@/components/Navigation";
import { UploadDocumentModal } from "@/components/Patients/UploadDocumentModal";
import styles from "./PatientDetailsScreen.module.css";

export type PatientDetailsData = {
  contact: string;
  country: string;
  dateOfBirth: string;
  email: string;
  emergencyContact: string;
  gender: string;
  name: string;
};

const timelineItems = [
  { icon: "bell", title: "Consultation with Dr. Smith", date: "Nov 13, 2026", actionable: true },
  { icon: "file-text", title: "Document Added - Weekly Report TKA-902231", date: "Nov 11, 2026", actionable: false },
  { icon: "stethoscope", title: "Consultation with Dr. Smith", date: "13/03/2026", actionable: false },
] as const;

const initialMedicalRecords = [
  "Aakashbhai Chaudhary - Renal Doppler Ultrasound (Kidneys and renal Arteries)",
  "Aakashbhai Chaudhary - Renal Doppler Ultrasound (Kidneys and renal Arteries)",
];

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function PatientDetailsScreen({ patient }: { patient: PatientDetailsData }) {
  const [tab, setTab] = useState<"general" | "health">("general");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState(initialMedicalRecords);

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
                <span className={styles.usersGlyph}>
                  <Image alt="" fill sizes="13px" src="/icons/patients/details/users-four.svg" />
                </span>
              </span>
              <span>Patients</span>
              <span className={styles.caretIcon}>
                <Image alt="" height={14} src="/icons/patients/details/caret-right.svg" width={14} />
              </span>
            </Link>
            <span className={styles.currentCrumb}>
              <span className={styles.userIcon}>
                <span className={styles.userGlyph}>
                  <Image alt="" fill sizes="13px" src="/icons/patients/details/user-circle.svg" />
                </span>
              </span>
              <span>{patient.name} - Patient profile</span>
            </span>
          </nav>

          <div className={styles.profileSection}>
            <section className={styles.patientInfo}>
              <header className={styles.infoHeader}>
                <span>Patient Info</span>
                <h1>{patient.name}</h1>
              </header>

              <div aria-label="Patient information" className={styles.segmented} role="tablist">
                <button aria-selected={tab === "general"} className={tab === "general" ? styles.segmentActive : ""} onClick={() => setTab("general")} role="tab" type="button">General Info.</button>
                <button aria-selected={tab === "health"} className={tab === "health" ? styles.segmentActive : ""} onClick={() => setTab("health")} role="tab" type="button">Health Info.</button>
              </div>

              {tab === "general" ? (
                <div className={styles.detailsTable}>
                  <DetailRow label="Full Name" value={patient.name} />
                  <DetailRow label="Contact Number" value={patient.contact} />
                  <DetailRow label="Email ID" value={patient.email} />
                  <DetailRow label="Gender" value={patient.gender} />
                  <DetailRow label="Date of Birth" value={patient.dateOfBirth} />
                  <DetailRow label="Residential Country" value={patient.country} />
                  <DetailRow label="Emergency Contact" value={patient.emergencyContact} />
                </div>
              ) : (
                <div className={styles.detailsTable}>
                  <DetailRow label="Blood Type" value="O+" />
                  <DetailRow label="Height" value="172cm" />
                  <DetailRow label="Weight" value="60kg" />
                  <DetailRow label="Allergies" value="None reported" />
                  <DetailRow label="Primary Physician" value="Dr. Smith" />
                </div>
              )}
            </section>

            <section className={styles.timelineSection}>
              <h2>Timeline</h2>
              <div className={styles.timeline}>
                {timelineItems.map((item, index) => (
                  <div className={styles.timelineGroup} key={`${item.title}-${item.date}`}>
                    <div className={styles.timelineItem}>
                      <span className={styles.timelineIcon}>
                        <Image alt="" height={24} src={`/icons/patients/details/${item.icon}.svg`} width={24} />
                      </span>
                      <span className={styles.timelineCopy}>
                        <strong>{item.title}</strong>
                        <span>{item.date}</span>
                      </span>
                      {item.actionable ? (
                        <span className={styles.timelineActions}>
                          <Image alt="Edit note" height={16} src="/icons/patients/details/note-pencil.svg" width={16} />
                          <Image alt="Open consultation" height={16} src="/icons/patients/details/arrow-right.svg" width={16} />
                        </span>
                      ) : null}
                    </div>
                    {index < timelineItems.length - 1 ? <span aria-hidden className={styles.timelineLine} /> : null}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className={styles.recordsSection}>
            <div className={styles.recordsHeader}>
              <h2>Medical Records</h2>
              <div className={styles.recordActions}>
                <Button
                  className={styles.accessButton}
                  leadingIcon={
                    <Image
                      alt=""
                      height={16}
                      src="/icons/patients/details/handshake.svg"
                      width={16}
                    />
                  }
                  variant="link"
                >
                  Access
                </Button>
                <Button
                  className={styles.uploadButton}
                  onClick={() => setIsUploadOpen(true)}
                  variant="primary"
                >
                  Upload Document
                </Button>
              </div>
            </div>
            <div className={styles.recordsTable}>
              {medicalRecords.map((record, index) => (
                <article className={styles.record} key={`${record}-${index}`}>
                  <Image alt="" height={48} src="/icons/patients/details/folder.svg" width={51} />
                  <div className={styles.recordCopy}>
                    <strong>{record}</strong>
                    <span>July 19, 2026</span>
                  </div>
                  <div className={styles.reference}>
                    <span>Ref. By</span>
                    <strong>Dr. Sarah Downey, Dr.Jane Foster</strong>
                  </div>
                  <span className={styles.contributor}>Contributor</span>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
      <UploadDocumentModal
        isOpen={isUploadOpen}
        onAddDocuments={(files, recordName) => {
          const label = recordName.trim();
          setMedicalRecords((records) => [
            ...records,
            ...files.map((file) => label || file.name),
          ]);
        }}
        onClose={() => setIsUploadOpen(false)}
      />
    </main>
  );
}
