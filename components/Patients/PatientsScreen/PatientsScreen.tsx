"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { PrimaryNavigation } from "@/components/Navigation";
import styles from "./PatientsScreen.module.css";

export type PatientStatus = "approved" | "pending" | "declined";

export type Patient = {
  age: number;
  avatar: string;
  bloodType?: string;
  gender: string;
  height: string;
  id: string;
  lastVisit: string;
  name: string;
  role: string;
  status: PatientStatus;
  weight: string;
};

export type PatientsView = "grid" | "list";
export type PatientsTab = "mine" | "pending";

const statusLabels: Record<PatientStatus, string> = {
  approved: "Approved",
  declined: "Declined",
  pending: "Pending",
};

const initialPatients: Patient[] = [
  { id: "p-1", name: "Sarah Johnson", age: 26, gender: "Female", avatar: "/images/patients/avatar.svg", role: "Contributor", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
  { id: "p-2", name: "Sarah Johnson", age: 26, gender: "Female", avatar: "/images/patients/avatar.svg", role: "Contributor", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
  { id: "p-3", name: "Sarah Johnson", age: 26, gender: "Female", avatar: "/images/patients/avatar.svg", role: "Contributor", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
  { id: "p-4", name: "Sarah Johnson", age: 26, gender: "Female", avatar: "/images/patients/avatar.svg", role: "Contributor", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
];

const initialPending: Patient[] = [
  { id: "r-1", name: "Marcus Lee", age: 34, gender: "Male", avatar: "/images/working-hours/avatar-5.png", role: "Viewer", weight: "78kg", height: "181cm", lastVisit: "Feb 18, 2026", status: "pending" },
  { id: "r-2", name: "Amelia Chen", age: 29, gender: "Female", avatar: "/images/working-hours/avatar-6.png", role: "Viewer", weight: "56kg", height: "164cm", lastVisit: "Feb 02, 2026", status: "pending" },
];

const initialGridPatients: Patient[] = [
  { id: "g-1", name: "Sarah Johnson", age: 26, gender: "Female", bloodType: "O+", avatar: "/images/patients/sarah.svg", role: "Contributor", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
  { id: "g-2", name: "Jose Merinez", age: 29, gender: "Male", bloodType: "O+", avatar: "/images/patients/jose.svg", role: "Full Access", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
  { id: "g-3", name: "Sarah Johnson", age: 26, gender: "Female", bloodType: "O+", avatar: "/images/patients/sarah.svg", role: "Contributor", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
  { id: "g-4", name: "Gerard De Santa", age: 36, gender: "Male", bloodType: "O+", avatar: "/images/patients/gerard.svg", role: "No Access", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
  { id: "g-5", name: "Tilly Jenae", age: 42, gender: "Female", bloodType: "O+", avatar: "/images/patients/tilly.svg", role: "Contributor", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
  { id: "g-6", name: "Sarah Johnson", age: 26, gender: "Female", bloodType: "O+", avatar: "/images/patients/sarah.svg", role: "Contributor", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
  { id: "g-7", name: "Odona Seikwa", age: 24, gender: "Female", bloodType: "O+", avatar: "/images/patients/odona.svg", role: "Contributor", weight: "60kg", height: "172cm", lastVisit: "Mar 03, 2026", status: "approved" },
];

/** Two-digit count used by the tab badges, matching the Figma "02" treatment. */
function formatCount(count: number) {
  return count.toString().padStart(2, "0");
}

/** Figma tints the gender label; only Female is specified, so others fall back to a neutral tone. */
function genderTone(gender: string) {
  const key = gender.trim().toLowerCase();
  if (key === "female") return styles.genderFemale;
  if (key === "male") return styles.genderMale;
  return styles.genderNeutral;
}

function PatientIdentity({
  patient,
  compact = false,
  showBloodType = false,
}: {
  patient: Patient;
  compact?: boolean;
  showBloodType?: boolean;
}) {
  const tone = genderTone(patient.gender);

  return (
    <div className={`${styles.identity} ${compact ? styles.identityCompact : ""}`}>
      <span className={styles.avatar}>
        <Image alt="" height={45} src={patient.avatar} unoptimized width={45} />
      </span>
      <span className={styles.identityCopy}>
        <span className={styles.name}>{patient.name}</span>
        <span className={styles.meta}>
          <span className={styles.age}>{patient.age}</span>
          <span aria-hidden className={`${styles.metaDot} ${tone}`} />
          <span className={`${styles.gender} ${tone}`}>{patient.gender}</span>
          {showBloodType ? <span className={styles.bloodType}>{patient.bloodType ?? "O+"}</span> : null}
        </span>
      </span>
    </div>
  );
}

function StatusTag({ status }: { status: PatientStatus }) {
  return (
    <span className={`${styles.statusTag} ${styles[`status${status[0].toUpperCase()}${status.slice(1)}`]}`}>
      <span aria-hidden className={styles.statusDot} />
      {statusLabels[status]}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value}</span>
    </div>
  );
}

function PatientRow({ onOpen, patient }: { onOpen: (patient: Patient) => void; patient: Patient }) {
  return (
    <article
      aria-label={`View ${patient.name}'s profile`}
      className={styles.row}
      onClick={() => onOpen(patient)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen(patient);
      }}
      role="link"
      tabIndex={0}
    >
      <PatientIdentity patient={patient} />
      <div className={styles.rowFields}>
        <span className={styles.rolePill}>{patient.role}</span>
        <Field label="Weight" value={patient.weight} />
        <Field label="Height" value={patient.height} />
        <Field label="Last Visit" value={patient.lastVisit} />
        <div className={styles.statusField}>
          <span className={styles.fieldLabel}>Status</span>
          <StatusTag status={patient.status} />
        </div>
      </div>
    </article>
  );
}

function roleTone(role: string) {
  if (role === "Full Access") return styles.roleFullAccess;
  if (role === "No Access") return styles.roleNoAccess;
  return "";
}

function PatientCard({ onOpen, patient }: { onOpen: (patient: Patient) => void; patient: Patient }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardContent}>
        <PatientIdentity compact patient={patient} showBloodType />
        <div className={styles.cardTags}>
          <span className={`${styles.rolePill} ${roleTone(patient.role)}`}>{patient.role}</span>
          <StatusTag status={patient.status} />
        </div>
        <div className={styles.cardDivider} />
        <div className={styles.cardFields}>
          <Field label="Last Visit" value={patient.lastVisit} />
          <Field label="Height" value={patient.height} />
          <Field label="Weight" value={patient.weight} />
        </div>
      </div>
      <Button className={styles.profileButton} onClick={() => onOpen(patient)} variant="bordered">View Profile</Button>
    </article>
  );
}

export type PatientsScreenProps = {
  patients?: Patient[];
  pendingRequests?: Patient[];
};

export function PatientsScreen({
  patients = initialPatients,
  pendingRequests = initialPending,
}: PatientsScreenProps) {
  const router = useRouter();
  const [tab, setTab] = useState<PatientsTab>("mine");
  const [view, setView] = useState<PatientsView>("list");
  const [ascending, setAscending] = useState<boolean | null>(null);

  const gridPatients = patients === initialPatients ? initialGridPatients : patients;
  const activePatients = tab === "mine" ? (view === "grid" ? gridPatients : patients) : pendingRequests;
  const patientCount = patients === initialPatients ? 24 : patients.length;

  const sortedPatients = useMemo(() => {
    if (ascending === null) return activePatients;
    const direction = ascending ? 1 : -1;
    return [...activePatients].sort((a, b) => direction * a.name.localeCompare(b.name));
  }, [activePatients, ascending]);

  const tabs: Array<{ count: number; id: PatientsTab; label: string }> = [
    { id: "mine", label: "My Patients", count: patientCount },
    { id: "pending", label: "Pending Requests", count: pendingRequests.length },
  ];

  const openPatient = (patient: Patient) => router.push(`/patients/${patient.id}`);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <PrimaryNavigation activeId="patients" fullHeight />
        </aside>

        <section aria-labelledby="patients-heading" className={styles.workspace}>
          <div className={styles.breadcrumb}>
            <Image alt="" height={16} src="/icons/patients/figma/users-four.svg" width={16} />
            <span>Patients</span>
          </div>

          <header className={styles.workspaceHeader}>
            <div className={styles.headingCopy}>
              <h1 id="patients-heading">Patients</h1>
              <p>Onboard and manage patient medical records.</p>
            </div>

            <div aria-label="View" className={styles.viewToggle} role="radiogroup">
              <button
                aria-checked={view === "grid"}
                aria-label="Grid view"
                className={`${styles.viewButton} ${view === "grid" ? styles.viewButtonActive : ""}`}
                onClick={() => setView("grid")}
                role="radio"
                type="button"
              >
                <Image alt="" height={18} src="/icons/patients/figma/squares-four.svg" width={18} />
              </button>
              <button
                aria-checked={view === "list"}
                aria-label="List view"
                className={`${styles.viewButton} ${view === "list" ? styles.viewButtonActive : ""}`}
                onClick={() => setView("list")}
                role="radio"
                type="button"
              >
                <Image alt="" height={18} src="/icons/patients/figma/list-bullets.svg" width={18} />
              </button>
            </div>
          </header>

          <div className={styles.tabsRow}>
            <div aria-label="Patient lists" className={styles.tabs} role="tablist">
              {tabs.map((item) => (
                <button
                  aria-selected={tab === item.id}
                  className={`${styles.tab} ${tab === item.id ? styles.tabActive : ""}`}
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  role="tab"
                  type="button"
                >
                  <span className={styles.tabLabel}>{item.label}</span>
                  <span className={styles.tabBadge}>{formatCount(item.count)}</span>
                </button>
              ))}
            </div>
            <button
              aria-label={`Sort by name, ${ascending === null ? "not applied" : ascending ? "ascending" : "descending"}`}
              className={styles.sortButton}
              onClick={() => setAscending((value) => value === null ? true : !value)}
              type="button"
            >
              <Image alt="" height={16} src="/icons/patients/figma/sort.svg" width={16} />
            </button>
          </div>

          {sortedPatients.length === 0 ? (
            <p className={styles.emptyResults}>No patients to show.</p>
          ) : (
            <div className={view === "list" ? styles.listSurface : styles.gridSurface}>
              {sortedPatients.map((patient) => (
                view === "list"
                  ? <PatientRow key={patient.id} onOpen={openPatient} patient={patient} />
                  : <PatientCard key={patient.id} onOpen={openPatient} patient={patient} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
