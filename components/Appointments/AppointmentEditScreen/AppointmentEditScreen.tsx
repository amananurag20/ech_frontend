"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { SecondaryNavigation } from "@/components/Navigation";
import { Toggle } from "@/components/Toggle";
import type { AppointmentType } from "../AppointmentsScreen/AppointmentsScreen";
import styles from "./AppointmentEditScreen.module.css";

type AppointmentEditScreenProps = {
  appointment: AppointmentType;
  onBack: (appointment: AppointmentType) => void;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const julyDays = Array.from({ length: 35 }, (_, index) => index < 2 || index > 32 ? 0 : index - 1);

type Location = "Video Call" | "Phone Call" | "In-Person" | "More";

const locationOptions: Array<{ icon: string; label: Location }> = [
  { icon: "▣", label: "Video Call" },
  { icon: "☎", label: "Phone Call" },
  { icon: "⌖", label: "In-Person" },
  { icon: "•••", label: "More" },
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
  const [selectedDate, setSelectedDate] = useState(16);
  const safeDuration = useMemo(() => Math.max(1, Number.parseInt(duration, 10) || 1), [duration]);

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
                <input readOnly value={`medqtcare.com/appointments?type=${appointment.id}`} />
              </label>

              <label className={styles.field}>
                <span>Description</span>
                <span className={styles.descriptionEditor}>
                  <span className={styles.editorToolbar}>
                    <button type="button">Normal⌄</button>
                    <button aria-label="Bold" className={styles.boldTool} type="button">B</button>
                    <button aria-label="Italic" className={styles.italicTool} type="button">I</button>
                    <button aria-label="Insert link" type="button">↗</button>
                  </span>
                  <textarea onChange={(event) => setDescription(event.target.value)} value={description} />
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
                      <span aria-hidden>{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <section className={styles.expandableSection}>
                <button className={styles.sectionHeading} onClick={() => setLimitsOpen((open) => !open)} type="button">
                  <span><strong>Limits &amp; Buffers</strong><small>Define how soon before and after an appointment can be booked.</small></span>
                  <span aria-hidden>{limitsOpen ? "⌃" : "⌄"}</span>
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
                  <span><strong>Limited Meetings</strong><small>Set the maximum number of meetings allowed in a period.</small></span>
                  <span aria-hidden>{limitedMeetingsOpen ? "−" : "+"}</span>
                </button>
                {limitedMeetingsOpen ? (
                  <div className={styles.limitFields}>
                    <label className={styles.field}>
                      <span>No. of meetings</span>
                      <select defaultValue="1"><option>1</option><option>2</option><option>3</option></select>
                    </label>
                    <label className={styles.field}>
                      <span>per</span>
                      <select defaultValue="day"><option>day</option><option>week</option><option>month</option></select>
                    </label>
                    <button aria-label="Remove limit" className={styles.removeLimit} type="button">−</button>
                  </div>
                ) : null}
              </section>
            </form>

            <aside aria-label="Appointment preview" className={styles.previewPanel}>
              <div className={styles.previewStack}>
                <article className={styles.summaryCard}>
                  <div className={styles.doctorRow}>
                    <Image alt="Dr. Giana Hart" className={styles.avatar} height={40} src="/images/booking/date/doctor-avatar.png" width={40} />
                    <span><strong>Dr. Giana Hart</strong><small>Cardiologist</small></span>
                  </div>
                  <h2>{title.trim() || "Appointment"}</h2>
                  <div className={styles.summaryTags}>
                    <span><Image alt="" height={13} src="/icons/booking/date/clock.svg" width={13} />{safeDuration}m</span>
                    <span><Image alt="" height={13} src="/icons/booking/date/location.svg" width={10} />Medical Clinic</span>
                    <span><Image alt="" height={13} src="/icons/booking/date/globe.svg" width={13} />Asia/Singapore</span>
                  </div>
                </article>

                <section className={styles.calendar}>
                  <header className={styles.calendarHeader}>
                    <button aria-label="Previous month" type="button">‹</button>
                    <h3>July <span>2026</span></h3>
                    <button aria-label="Next month" type="button">›</button>
                  </header>
                  <div className={styles.calendarGrid}>
                    {weekdays.map((weekday) => <span className={styles.weekday} key={weekday}>{weekday}</span>)}
                    {julyDays.map((day, index) => day ? (
                      <button
                        aria-current={day === 7 ? "date" : undefined}
                        aria-label={`July ${day}, 2026`}
                        aria-pressed={day === selectedDate}
                        className={`${styles.calendarDay} ${day === 7 ? styles.today : ""} ${day === selectedDate ? styles.selectedDay : ""}`}
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        type="button"
                      >
                        {day}
                      </button>
                    ) : <span aria-hidden className={styles.emptyDay} key={`empty-${index}`} />)}
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
