"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { SearchField } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { PrimaryNavigation } from "@/components/Navigation";
import { Tag } from "@/components/Tag";
import { Toggle } from "@/components/Toggle";
import { AppointmentEditScreen } from "../AppointmentEditScreen";
import styles from "./AppointmentsScreen.module.css";

export type AppointmentType = {
  duration: string;
  hidden?: boolean;
  id: string;
  name: string;
};

const initialAppointments: AppointmentType[] = [
  { id: "routine", name: "Routine Visits", duration: "30m" },
  { id: "specialty", name: "Specialty Consultation", duration: "15m", hidden: true },
  { id: "follow-up", name: "Follow-up", duration: "10m" },
];

type AppointmentsScreenProps = {
  appointments?: AppointmentType[];
};

function EmptyAppointments({ onCreate }: { onCreate: () => void }) {
  return (
    <div className={styles.emptyAppointments}>
      <div aria-hidden className={styles.emptyIllustration}>
        <Image alt="" className={styles.emptyCalendar} height={86} src="/icons/appointments/empty/calendar.svg" width={86} />
        <span className={styles.emptyClock}>
          <Image alt="" className={styles.clockLayerOne} height={18} src="/icons/appointments/empty/clock-1.svg" width={18} />
          <Image alt="" className={styles.clockLayerTwo} height={19} src="/icons/appointments/empty/clock-2.svg" width={19} />
        </span>
        <span className={styles.emptyLink}>
          <Image alt="" className={styles.linkLayerOne} height={18} src="/icons/appointments/empty/link-1.svg" width={21} />
          <Image alt="" className={styles.linkLayerTwo} height={19} src="/icons/appointments/empty/link-2.svg" width={23} />
        </span>
        <Image alt="" className={styles.emptyDotOne} height={5} src="/icons/appointments/empty/dot-1.svg" width={5} />
        <Image alt="" className={styles.emptyDotTwo} height={5} src="/icons/appointments/empty/dot-2.svg" width={5} />
      </div>
      <div className={styles.emptyCopy}>
        <h2>Create your Appointments</h2>
        <p>Share links that show available times on your calendar<br />and allow people to make bookings with you.</p>
      </div>
      <Button className={styles.createButton} onClick={onCreate} variant="primary">Create</Button>
    </div>
  );
}

type AppointmentRowProps = {
  appointment: AppointmentType;
  onDelete: (appointment: AppointmentType) => void;
  onDuplicate: (appointment: AppointmentType) => void;
  onEdit: (appointment: AppointmentType) => void;
};

function AppointmentRow({ appointment, onDelete, onDuplicate, onEdit }: AppointmentRowProps) {
  const [isHidden, setIsHidden] = useState(Boolean(appointment.hidden));
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const copyLink = async () => {
    await navigator.clipboard?.writeText(`${window.location.origin}/patient/new-booking?type=${appointment.id}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <article className={styles.appointmentRow}>
      <span aria-hidden className={styles.dragSpace} />
      <div className={styles.appointmentDescription}>
        <div className={styles.appointmentTitle}>
          <h2>{appointment.name}</h2>
          <p>One-on-One</p>
        </div>
        <div className={styles.tags}>
          <Tag
            className={isHidden ? styles.durationNeutral : styles.durationColor}
            label={appointment.duration}
            leadingIcon={<Image alt="" height={16} src={isHidden ? "/icons/appointments/clock-neutral.svg" : "/icons/appointments/clock.svg"} width={16} />}
            type={isHidden ? "neutral" : "color"}
          />
          {isHidden ? (
            <Tag
              className={styles.hiddenTag}
              label="Hidden"
              leadingIcon={<Image alt="" height={16} src="/icons/appointments/hidden.svg" width={16} />}
              type="neutral"
            />
          ) : null}
        </div>
      </div>

      <div className={styles.rowActions}>
        {isHidden ? (
          <Button onClick={() => setIsHidden(false)} variant="bordered">Show</Button>
        ) : (
          <Button
            leadingIcon={<Image alt="" height={14} src="/icons/appointments/link.svg" width={14} />}
            onClick={copyLink}
            variant="bordered"
          >
            {copied ? "Copied" : "Copy Link"}
          </Button>
        )}
        <div aria-label={`${appointment.name} actions`} className={styles.compactActions} role="group">
          <button aria-label={`Open ${appointment.name}`} type="button">
            <Image alt="" height={11} src="/icons/appointments/external.svg" width={11} />
          </button>
          <div className={styles.menuAnchor} ref={menuRef}>
            <button
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label={`More options for ${appointment.name}`}
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <Image alt="" height={10} src="/icons/appointments/more.svg" width={2} />
            </button>
            {menuOpen ? (
              <div aria-label={`${appointment.name} options`} className={styles.appointmentMenu} role="menu">
                <div className={`${styles.menuItem} ${styles.hideMenuItem}`} role="none">
                  <span className={styles.menuItemCopy}>
                    <Image alt="" height={16} src="/icons/appointments/menu/eye.svg" width={16} />
                    <span>Hide (On/Off)</span>
                  </span>
                  <Toggle
                    aria-label={`Hide ${appointment.name}`}
                    checked={isHidden}
                    onCheckedChange={setIsHidden}
                  />
                </div>
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit({ ...appointment, hidden: isHidden });
                  }}
                  role="menuitem"
                  type="button"
                >
                  <Image alt="" height={16} src="/icons/appointments/menu/edit.svg" width={16} />
                  <span>Edit</span>
                </button>
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate({ ...appointment, hidden: isHidden });
                  }}
                  role="menuitem"
                  type="button"
                >
                  <Image alt="" height={16} src="/icons/appointments/menu/duplicate.svg" width={16} />
                  <span>Duplicate</span>
                </button>
                <button className={`${styles.menuItem} ${styles.embedMenuItem}`} onClick={() => setMenuOpen(false)} role="menuitem" type="button">
                  <Image alt="" height={16} src="/icons/appointments/menu/embed.svg" width={16} />
                  <span>Embed</span>
                </button>
                <button
                  className={`${styles.menuItem} ${styles.deleteMenuItem}`}
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(appointment);
                  }}
                  role="menuitem"
                  type="button"
                >
                  <Image alt="" height={16} src="/icons/appointments/menu/delete.svg" width={16} />
                  <span>Delete</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

type DuplicateAppointmentModalProps = {
  appointment: AppointmentType;
  onClose: () => void;
  onDuplicate: (appointment: AppointmentType) => void;
};

type AddAppointmentModalProps = {
  onClose: () => void;
  onCreate: (appointment: AppointmentType) => void;
};

function AddAppointmentModal({ onClose, onCreate }: AddAppointmentModalProps) {
  const [title, setTitle] = useState("Pre-Operative");
  const [duration, setDuration] = useState("20");
  const [slug, setSlug] = useState("routine-visits");
  const [allowMultipleDurations, setAllowMultipleDurations] = useState(false);

  const submitAppointment = () => {
    if (!title.trim() || !duration.trim() || !slug.trim()) return;
    const normalizedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    onCreate({
      duration: `${Math.max(1, Number.parseInt(duration, 10) || 1)}m`,
      id: `${normalizedSlug}-${Date.now()}`,
      name: title.trim(),
    });
  };

  return (
    <Modal ariaLabel="Add a new Appointment" className={styles.duplicateDialog} isOpen onClose={onClose}>
      <header className={styles.duplicateHeader}>
        <div className={styles.modalHeading}>
          <h2>Add a new Appointment</h2>
          <p>Set up a new type of appointment meeting for patients</p>
        </div>
        <button aria-label="Close add appointment dialog" className={styles.closeButton} onClick={onClose} type="button">
          <Image alt="" className={styles.closeLineOne} height={16} src="/icons/appointments/modal/close-1.svg" width={16} />
          <Image alt="" className={styles.closeLineTwo} height={16} src="/icons/appointments/modal/close-2.svg" width={16} />
        </button>
      </header>

      <div className={styles.duplicateContent}>
        <label className={styles.modalField}>
          <span>Title</span>
          <input onChange={(event) => setTitle(event.target.value)} value={title} />
        </label>
        <div className={styles.durationSection}>
          <label className={styles.modalField}>
            <span>Duration</span>
            <span className={styles.inputWithSuffix}>
              <input inputMode="numeric" onChange={(event) => setDuration(event.target.value.replace(/\D/g, ""))} value={duration} />
              <span>minutes</span>
            </span>
          </label>
          <div className={styles.multipleDurationRow}>
            <span>Allow multiple durations</span>
            <Toggle
              aria-label="Allow multiple durations"
              checked={allowMultipleDurations}
              onCheckedChange={setAllowMultipleDurations}
            />
          </div>
        </div>
        <label className={styles.modalField}>
          <span>URL</span>
          <span className={styles.urlInput}>
            <span>medqtcare.com/appointments?type=</span>
            <input onChange={(event) => setSlug(event.target.value)} value={slug} />
          </span>
        </label>
      </div>

      <div className={styles.modalActions}>
        <Button onClick={onClose} variant="bordered">Cancel</Button>
        <Button
          disabled={!title.trim() || !duration.trim() || !slug.trim()}
          onClick={submitAppointment}
          trailingIcon={<Image alt="" height={14} src="/icons/appointments/modal/arrow-right.svg" width={14} />}
          variant="primary"
        >
          Create
        </Button>
      </div>
    </Modal>
  );
}

function DuplicateAppointmentModal({ appointment, onClose, onDuplicate }: DuplicateAppointmentModalProps) {
  const [title, setTitle] = useState(appointment.name);
  const [duration, setDuration] = useState(appointment.duration.replace(/\D/g, "") || "20");
  const [slug, setSlug] = useState(appointment.id);
  const [allowMultipleDurations, setAllowMultipleDurations] = useState(false);

  const submitDuplicate = () => {
    if (!title.trim() || !duration.trim() || !slug.trim()) return;
    onDuplicate({
      ...appointment,
      duration: `${Math.max(1, Number.parseInt(duration, 10) || 1)}m`,
      id: `${slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`,
      name: title.trim(),
    });
  };

  return (
    <Modal ariaLabel="Duplicate appointment type" className={styles.duplicateDialog} isOpen onClose={onClose}>
      <header className={styles.duplicateHeader}>
        <div className={styles.modalHeading}>
          <h2>Duplicate appointment type</h2>
          <p>duplicate the configuration of this appointment</p>
        </div>
        <button aria-label="Close duplicate appointment dialog" className={styles.closeButton} onClick={onClose} type="button">
          <Image alt="" className={styles.closeLineOne} height={16} src="/icons/appointments/modal/close-1.svg" width={16} />
          <Image alt="" className={styles.closeLineTwo} height={16} src="/icons/appointments/modal/close-2.svg" width={16} />
        </button>
      </header>

      <div className={styles.duplicateContent}>
        <label className={styles.modalField}>
          <span>Title</span>
          <input onChange={(event) => setTitle(event.target.value)} value={title} />
        </label>
        <div className={styles.durationSection}>
          <label className={styles.modalField}>
            <span>Duration</span>
            <span className={styles.inputWithSuffix}>
              <input inputMode="numeric" onChange={(event) => setDuration(event.target.value.replace(/\D/g, ""))} value={duration} />
              <span>minutes</span>
            </span>
          </label>
          <div className={styles.multipleDurationRow}>
            <span>Allow multiple durations</span>
            <Toggle
              aria-label="Allow multiple durations"
              checked={allowMultipleDurations}
              onCheckedChange={setAllowMultipleDurations}
            />
          </div>
        </div>
        <label className={styles.modalField}>
          <span>URL</span>
          <span className={styles.urlInput}>
            <span>medqtcare.com/appointments?type=</span>
            <input onChange={(event) => setSlug(event.target.value)} value={slug} />
          </span>
        </label>
      </div>

      <div className={styles.modalActions}>
        <Button onClick={onClose} variant="bordered">Cancel</Button>
        <Button disabled={!title.trim() || !duration.trim() || !slug.trim()} onClick={submitDuplicate} variant="primary">Duplicate</Button>
      </div>
    </Modal>
  );
}

type DeleteAppointmentModalProps = {
  appointment: AppointmentType | null;
  onClose: () => void;
  onDelete: () => void;
};

function DeleteAppointmentModal({ appointment, onClose, onDelete }: DeleteAppointmentModalProps) {
  return (
    <Modal ariaLabel="Delete appointment type" className={styles.deleteDialog} isOpen={Boolean(appointment)} onClose={onClose}>
      <div className={styles.deleteCopy}>
        <h2>Delete appointment type</h2>
        <p>Anyone who you&apos;ve shared this link with will no longer be able to book using it.</p>
      </div>
      <div className={styles.modalActions}>
        <Button onClick={onClose} variant="bordered">Cancel</Button>
        <Button destructive onClick={onDelete} variant="primary">Delete</Button>
      </div>
    </Modal>
  );
}

export function AppointmentsScreen({ appointments = initialAppointments }: AppointmentsScreenProps) {
  const [search, setSearch] = useState("");
  const [appointmentItems, setAppointmentItems] = useState(appointments);
  const [addOpen, setAddOpen] = useState(false);
  const [duplicateTarget, setDuplicateTarget] = useState<AppointmentType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppointmentType | null>(null);
  const [editTarget, setEditTarget] = useState<AppointmentType | null>(null);
  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? appointmentItems.filter((appointment) => appointment.name.toLowerCase().includes(query)) : appointmentItems;
  }, [appointmentItems, search]);
  const hasAppointments = appointmentItems.length > 0;

  const duplicateAppointment = (appointment: AppointmentType) => {
    setAppointmentItems((items) => [...items, appointment]);
    setDuplicateTarget(null);
  };

  const createAppointment = (appointment: AppointmentType) => {
    setAppointmentItems((items) => [...items, appointment]);
    setAddOpen(false);
  };

  const deleteAppointment = () => {
    if (!deleteTarget) return;
    setAppointmentItems((items) => items.filter((appointment) => appointment.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const finishEditing = (updatedAppointment: AppointmentType) => {
    setAppointmentItems((items) => items.map((item) => item.id === updatedAppointment.id ? updatedAppointment : item));
    setEditTarget(null);
  };

  if (editTarget) {
    return <AppointmentEditScreen appointment={editTarget} onBack={finishEditing} />;
  }

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <PrimaryNavigation defaultActiveId="appointments" fullHeight />
        </aside>

        <section aria-labelledby="appointments-heading" className={styles.workspace}>
          <header className={styles.workspaceHeader}>
            <div className={styles.headingCopy}>
              <h1 id="appointments-heading">Appointment Types</h1>
              <p>Configure different appointments for patients on your calendar.</p>
            </div>
            <SearchField
              aria-label="Search appointments"
              className={styles.search}
              onChange={(event) => setSearch(event.target.value)}
              onClear={() => setSearch("")}
              placeholder="Search Appointments"
              value={search}
            />
            <Button
              className={styles.addButton}
              leadingIcon={<Image alt="" height={14} src="/icons/appointments/plus.svg" width={14} />}
              onClick={() => setAddOpen(true)}
              variant="primary"
            >
              Add New
            </Button>
          </header>

          <div className={`${styles.appointmentsSurface} ${!hasAppointments ? styles.emptySurface : ""}`}>
            {!hasAppointments ? <EmptyAppointments onCreate={() => setAddOpen(true)} /> : <>
              {filteredAppointments.map((appointment) => (
                <AppointmentRow
                  appointment={appointment}
                  key={appointment.id}
                  onDelete={setDeleteTarget}
                  onDuplicate={setDuplicateTarget}
                  onEdit={setEditTarget}
                />
              ))}
              {filteredAppointments.length === 0 ? <p className={styles.emptyResults}>No appointments found.</p> : null}
            </>}
          </div>
        </section>
      </div>
      {addOpen ? <AddAppointmentModal onClose={() => setAddOpen(false)} onCreate={createAppointment} /> : null}
      {duplicateTarget ? (
        <DuplicateAppointmentModal
          appointment={duplicateTarget}
          key={duplicateTarget.id}
          onClose={() => setDuplicateTarget(null)}
          onDuplicate={duplicateAppointment}
        />
      ) : null}
      <DeleteAppointmentModal appointment={deleteTarget} onClose={() => setDeleteTarget(null)} onDelete={deleteAppointment} />
    </main>
  );
}
