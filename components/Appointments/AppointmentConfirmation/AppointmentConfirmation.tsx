"use client";

import Image from "next/image";
import type { DragEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/Button";
import styles from "./AppointmentConfirmation.module.css";

type ButtonHierarchy = "Primary" | "Secondary";

type RedirectLink = {
  hierarchy: ButtonHierarchy;
  id: string;
  label: string;
  url: string;
};

const initialLinks: RedirectLink[] = [
  { hierarchy: "Primary", id: "visit-us", label: "Visit Us", url: "https://www.medqtcare.com/appointments/confirmation/bk-982x11-q7" },
  { hierarchy: "Secondary", id: "see-doctor", label: "See Doctor", url: "https://www.medqtcare.com/doctors/profile/dr-giana-hart" },
];

function DetailIcon({ name }: { name: "calendar" | "globe" | "location" }) {
  const layers = name === "calendar" ? ["calendar-2", "calendar-1"] : name === "globe" ? ["globe-1", "globe-2"] : ["location-1", "location-2"];
  return (
    <span aria-hidden className={styles.detailIcon}>
      {layers.map((layer) => <Image alt="" height={20} key={layer} src={`/icons/booking/confirmation/${layer}.svg`} width={20} />)}
    </span>
  );
}

function DragHandle() {
  return <span aria-hidden className={styles.dragHandle}>{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</span>;
}

export function AppointmentConfirmation({ title }: { title: string }) {
  const [afterBooking, setAfterBooking] = useState("confirmation");
  const [links, setLinks] = useState(initialLinks);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const updateLink = <Key extends keyof RedirectLink>(id: string, key: Key, value: RedirectLink[Key]) => {
    setLinks((current) => current.map((link) => link.id === id ? { ...link, [key]: value } : link));
  };

  const addLink = () => {
    setLinks((current) => [...current, {
      hierarchy: "Secondary",
      id: `redirect-${crypto.randomUUID()}`,
      label: "New Link",
      url: "https://www.medqtcare.com/",
    }]);
  };

  const reorderLink = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return setDraggedId(null);
    setLinks((current) => {
      const from = current.findIndex((link) => link.id === draggedId);
      const to = current.findIndex((link) => link.id === targetId);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedId(null);
  };

  return (
    <div className={styles.layout}>
      <section className={styles.editorPanel}>
        <label className={styles.field}>
          <span>After booking</span>
          <select onChange={(event) => setAfterBooking(event.target.value)} value={afterBooking}>
            <option value="confirmation">Show Confirmation page</option>
            <option value="redirect">Redirect to the first link</option>
          </select>
        </label>

        <div className={styles.redirectHeading}>
          <span><strong>Redirect Links</strong><small>Customize redirect buttons that appear after a successful booking</small></span>
          <button aria-label="Add redirect link" onClick={addLink} type="button"><Image alt="" height={18} src="/icons/appointments/plus.svg" width={18} /></button>
        </div>

        <div className={styles.linkList}>
          {links.map((link) => (
            <article
              className={`${styles.linkCard} ${draggedId === link.id ? styles.dragging : ""}`}
              draggable
              key={link.id}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDragStart={(event: DragEvent<HTMLElement>) => {
                setDraggedId(link.id);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", link.id);
              }}
              onDrop={(event) => { event.preventDefault(); reorderLink(link.id); }}
            >
              <DragHandle />
              <div className={styles.linkFields}>
                <div className={styles.fieldColumns}>
                  <label className={styles.field}>
                    <span>Redirect button URL</span>
                    <input onChange={(event) => updateLink(link.id, "url", event.target.value)} value={link.url} />
                  </label>
                  <label className={styles.field}>
                    <span>Button label</span>
                    <input onChange={(event) => updateLink(link.id, "label", event.target.value)} value={link.label} />
                  </label>
                </div>
                <label className={styles.field}>
                  <span>Button hierarchy</span>
                  <select onChange={(event) => updateLink(link.id, "hierarchy", event.target.value as ButtonHierarchy)} value={link.hierarchy}>
                    <option>Primary</option>
                    <option>Secondary</option>
                  </select>
                </label>
              </div>
              <button aria-label={`Delete ${link.label || "redirect link"}`} className={styles.removeLink} onClick={() => setLinks((current) => current.filter((item) => item.id !== link.id))} type="button">
                <Image alt="" height={12} src="/icons/appointments/host/close.svg" width={12} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside aria-label="Confirmation page preview" className={styles.previewPanel}>
        {afterBooking === "confirmation" ? (
          <section className={styles.receipt}>
            <header className={styles.successHeader}>
              <span className={styles.successIcon}><Image alt="" height={52} src="/icons/booking/confirmation/success.svg" width={56} /></span>
              <span><strong>The Appointment is scheduled</strong><small>You will be notified via mail prior to the meeting</small></span>
            </header>

            <article className={styles.detailsCard}>
              <h2>{title}</h2>
              <div className={styles.schedule}>
                <div className={styles.detailRow}><DetailIcon name="calendar" /><span>Thursday July 30, 2026 <strong>@2:30 PM - 2:45 PM</strong></span></div>
                <div className={styles.detailRow}><DetailIcon name="globe" /><span>Asia/Singapore (GMT+8)</span></div>
              </div>
              <div className={styles.divider} />
              <div className={styles.detailRow}><DetailIcon name="location" /><span>Medical Clinic</span></div>
              <div className={styles.divider} />
              <div className={styles.doctorRow}>
                <span className={styles.avatar}><Image alt="Dr. Giana Hart" fill sizes="40px" src="/images/booking/confirmation/doctor.png" /></span>
                <span><strong>Dr. Giana Hart</strong><small>Cardiologist</small></span>
              </div>
              <div className={styles.previewActions}>
                {links.map((link) => (
                  <Button key={link.id} onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")} variant={link.hierarchy === "Primary" ? "neutral" : "bordered"}>
                    {link.label || "Untitled"}
                  </Button>
                ))}
              </div>
            </article>
          </section>
        ) : (
          <section className={styles.redirectPreview}>
            <span>After a successful booking</span>
            <strong>Patients will be redirected to:</strong>
            <a href={links[0]?.url || "#"}>{links[0]?.url || "Add a redirect link"}</a>
          </section>
        )}
      </aside>
    </div>
  );
}
