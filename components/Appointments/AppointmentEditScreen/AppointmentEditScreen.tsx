"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { AppointmentCalendar } from "@/components/Calendar/AppointmentCalendar";
import { SecondaryNavigation } from "@/components/Navigation";
import { Toggle } from "@/components/Toggle";
import { AppointmentPreviewCard } from "../AppointmentPreviewCard";
import type { AppointmentType } from "../AppointmentsScreen/AppointmentsScreen";
import styles from "./AppointmentEditScreen.module.css";

type AppointmentEditScreenProps = {
  appointment: AppointmentType;
  onBack: (appointment: AppointmentType) => void;
};

type Location = "Video Call" | "Phone Call" | "In-Person" | "More";

const locationOptions: Array<{ icon: string; label: Location }> = [
  { icon: "/icons/appointments/editor/video.svg", label: "Video Call" },
  { icon: "/icons/appointments/editor/phone.svg", label: "Phone Call" },
  { icon: "/icons/appointments/editor/map-pin.svg", label: "In-Person" },
  { icon: "/icons/appointments/editor/more.svg", label: "More" },
];

export function AppointmentEditScreen({ appointment, onBack }: AppointmentEditScreenProps) {
  const initialDuration = appointment.duration.replace(/\D/g, "") || "30";
  const [title, setTitle] = useState(appointment.name);
  const [duration, setDuration] = useState(initialDuration);
  const [hidden, setHidden] = useState(Boolean(appointment.hidden));
  const [allowMultipleDurations, setAllowMultipleDurations] = useState(false);
  const [description, setDescription] = useState("A quick checkup");
  const [location, setLocation] = useState<Location>("In-Person");
  const [limitsOpen, setLimitsOpen] = useState(true);
  const [limitedMeetingsOpen, setLimitedMeetingsOpen] = useState(true);
  const [visibleMonth, setVisibleMonth] = useState(new Date(2026, 6, 1));
  const [selectedDate, setSelectedDate] = useState(16);
  const safeDuration = useMemo(() => Math.max(1, Number.parseInt(duration, 10) || 1), [duration]);
  const previewYear = visibleMonth.getFullYear();
  const previewMonth = visibleMonth.getMonth();

  const finishEditing = () => {
    onBack({
      ...appointment,
      duration: `${safeDuration}m`,
      hidden,
      name: title.trim() || appointment.name,
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <SecondaryNavigation defaultActiveId="basic" onBack={finishEditing} />
        </aside>

        <section aria-labelledby="appointment-editor-title" className={styles.workspace}>
          <header className={styles.workspaceHeader}>
            <h1 id="appointment-editor-title">{title.trim() || "Appointment"}</h1>
            <div className={styles.headerActions}>
              <span>{hidden ? "Show" : "Hide"}</span>
              <Toggle aria-label="Hide appointment" checked={hidden} onCheckedChange={setHidden} />
              <button aria-label="Open public appointment page" type="button">
                <Image alt="" height={11} src="/icons/appointments/external.svg" width={11} />
              </button>
              <button aria-label="Copy appointment link" type="button">
                <Image alt="" height={14} src="/icons/appointments/link.svg" width={14} />
              </button>
              <button aria-label="Delete appointment" type="button">
                <Image alt="" height={16} src="/icons/appointments/menu/delete.svg" width={16} />
              </button>
              <Button
                leadingIcon={<Image alt="" height={14} src="/icons/appointments/plus.svg" width={14} />}
                variant="primary"
              >
                Add New
              </Button>
            </div>
          </header>

          <div className={styles.editorSurface}>
            <form className={styles.formPanel} onSubmit={(event) => event.preventDefault()}>
              <label className={styles.field}>
                <span>Title</span>
                <input onChange={(event) => setTitle(event.target.value)} value={title} />
              </label>

              <section className={styles.durationBlock}>
                <label className={styles.field}>
                  <span>Duration</span>
                  <span className={styles.suffixInput}>
                    <input
                      aria-label="Appointment duration"
                      inputMode="numeric"
                      onChange={(event) => setDuration(event.target.value.replace(/\D/g, ""))}
                      value={duration}
                    />
                    <span>minutes</span>
                  </span>
                </label>
                <div className={styles.toggleRow}>
                  <span>Allow multiple durations</span>
                  <Toggle
                    aria-label="Allow multiple durations"
                    checked={allowMultipleDurations}
                    onCheckedChange={setAllowMultipleDurations}
                  />
                </div>
              </section>

              <label className={styles.field}>
                <span>URL</span>
                <span className={styles.urlReadout}>
                  <span>medqtcare.com/appointments?type=</span>
                  <strong>{appointment.id}</strong>
                </span>
              </label>

              <label className={styles.field}>
                <span>Description</span>
                <span className={styles.descriptionEditor}>
                  <span className={styles.editorToolbar}>
                    <button className={styles.normalTool} type="button">
                      Normal
                      <Image alt="" height={14} src="/icons/appointments/editor/caret.svg" width={14} />
                    </button>
                    <span aria-hidden className={styles.toolbarDivider} />
                    <button aria-label="Bold" type="button"><Image alt="" height={18} src="/icons/appointments/editor/bold.svg" width={18} /></button>
                    <button aria-label="Italic" type="button"><Image alt="" height={18} src="/icons/appointments/editor/italic.svg" width={18} /></button>
                    <span aria-hidden className={styles.toolbarDivider} />
                    <button aria-label="Insert link" type="button"><Image alt="" height={18} src="/icons/appointments/editor/link.svg" width={18} /></button>
                  </span>
                  <textarea onChange={(event) => setDescription(event.target.value)} value={description} />
                  <Image alt="" className={styles.resizeNotches} height={14} src="/icons/appointments/editor/notches.svg" width={14} />
                </span>
              </label>

              <fieldset className={styles.locationField}>
                <legend>Location</legend>
                <div className={styles.locationOptions}>
                  {locationOptions.map((option) => (
                    <button
                      aria-pressed={location === option.label}
                      className={location === option.label ? styles.selectedLocation : ""}
                      key={option.label}
                      onClick={() => setLocation(option.label)}
                      type="button"
                    >
                      <Image alt="" height={18} src={option.icon} width={18} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <section className={styles.expandableSection}>
                <button className={styles.sectionHeading} onClick={() => setLimitsOpen((open) => !open)} type="button">
                  <span><strong>Limits &amp; Buffers</strong><small>Add buffer time before or after an appointment</small></span>
                  <Image alt="" className={!limitsOpen ? styles.caretClosed : ""} height={14} src="/icons/appointments/editor/caret.svg" width={14} />
                </button>
                {limitsOpen ? (
                  <div className={styles.sectionFields}>
                    <label className={styles.field}>
                      <span>Before event</span>
                      <select defaultValue="15 Minutes"><option>15 Minutes</option><option>30 Minutes</option><option>1 Hour</option></select>
                    </label>
                    <label className={styles.field}>
                      <span>After event</span>
                      <select defaultValue="No buffer"><option>No buffer</option><option>15 Minutes</option><option>30 Minutes</option></select>
                    </label>
                  </div>
                ) : null}
              </section>

              <section className={styles.expandableSection}>
                <button className={styles.sectionHeading} onClick={() => setLimitedMeetingsOpen((open) => !open)} type="button">
                  <span><strong>Limited Meetings</strong><small>Set maximum number of meetings for this appointment</small></span>
                  <Image alt="" height={14} src="/icons/appointments/editor/plus.svg" width={14} />
                </button>
                {limitedMeetingsOpen ? (
                  <div className={styles.limitFields}>
                    <label className={styles.field}>
                      <span>No. of meetings</span>
                      <select defaultValue="No buffer"><option>No buffer</option><option>1</option><option>2</option><option>3</option></select>
                    </label>
                    <label className={styles.field}>
                      <span>per</span>
                      <select defaultValue="day"><option>day</option><option>week</option><option>month</option></select>
                    </label>
                    <button aria-label="Remove limit" className={styles.removeLimit} type="button">
                      <Image alt="" height={14} src="/icons/appointments/editor/minus.svg" width={14} />
                    </button>
                  </div>
                ) : null}
              </section>
            </form>

            <aside aria-label="Appointment preview" className={styles.previewPanel}>
              <div className={styles.previewStack}>
                <AppointmentPreviewCard duration={safeDuration} title={title.trim() || "Appointment"} />
                <AppointmentCalendar
                  className={styles.previewCalendar}
                  compact
                  month={previewMonth}
                  onMonthChange={(offset) => {
                    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
                    setSelectedDate(0);
                  }}
                  onSelectDate={setSelectedDate}
                  selectedDate={selectedDate}
                  todayDate={previewYear === 2026 && previewMonth === 6 ? 7 : undefined}
                  year={previewYear}
                />
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
