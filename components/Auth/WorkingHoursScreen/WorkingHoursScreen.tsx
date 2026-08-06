"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Tag";
import styles from "./WorkingHoursScreen.module.css";

const dayDefinitions = [
  { name: "Sunday", initial: "S" },
  { name: "Monday", initial: "M" },
  { name: "Tuesday", initial: "T" },
  { name: "Wednesday", initial: "W" },
  { name: "Thursday", initial: "T" },
  { name: "Friday", initial: "F" },
  { name: "Saturday", initial: "S" },
] as const;

type DayName = (typeof dayDefinitions)[number]["name"];
type TimeSlot = { id: number; start: string; end: string };
export type WorkingHours = Record<DayName, TimeSlot[]>;

const timeOptions = Array.from({ length: 45 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 15;
  const hour24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
});

const defaultHours = Object.fromEntries(
  dayDefinitions.map(({ name }) => [
    name,
    name === "Sunday" || name === "Saturday" ? [] : [{ id: 1, start: "9:00 am", end: "5:00 pm" }],
  ]),
) as WorkingHours;

export type WorkingHoursScreenProps = {
  onContinue?: (hours: WorkingHours) => void | Promise<void>;
};

export function WorkingHoursScreen({ onContinue }: WorkingHoursScreenProps) {
  const router = useRouter();
  const [hours, setHours] = useState<WorkingHours>(defaultHours);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSlot = (day: DayName) => {
    setHours((current) => ({
      ...current,
      [day]: [...current[day], { id: Date.now(), start: "9:00 am", end: "5:00 pm" }],
    }));
  };

  const removeSlot = (day: DayName, id: number) => {
    setHours((current) => ({
      ...current,
      [day]: current[day].filter((slot) => slot.id !== id),
    }));
  };

  const updateSlot = (day: DayName, id: number, field: "start" | "end", value: string) => {
    setHours((current) => ({
      ...current,
      [day]: current[day].map((slot) => slot.id === id ? { ...slot, [field]: value } : slot),
    }));
  };

  const copyToAllDays = (sourceDay: DayName) => {
    setHours((current) => {
      const source = current[sourceDay];
      return Object.fromEntries(dayDefinitions.map(({ name }) => [
        name,
        source.map((slot, index) => ({ ...slot, id: Date.now() + index })),
      ])) as WorkingHours;
    });
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await onContinue?.(hours);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.navigation}>
        <Image alt="MedQT" height={28} priority src="/icons/navigation/medqt.svg" width={119} />
        <ol aria-label="Signup progress" className={styles.stepper}>
          <li className={styles.completedStep}>
            <Image alt="" height={18} src="/icons/auth/profile-check.svg" width={18} />
            <span>Register</span>
          </li>
          <li aria-hidden className={styles.stepLine} />
          <li className={styles.completedStep}>
            <Image alt="" height={18} src="/icons/auth/profile-check.svg" width={18} />
            <span>Set Up Account</span>
          </li>
          <li aria-hidden className={styles.stepLine} />
          <li aria-current="step" className={styles.currentStep}><i /><span>Working Hours</span></li>
        </ol>
      </header>

      <section aria-labelledby="working-hours-title" className={styles.shell}>
        <div className={styles.formPanel}>
          <Button
            className={styles.backButton}
            leadingIcon={<Image alt="" height={14} src="/icons/navigation/back.svg" width={14} />}
            onClick={() => router.back()}
            variant="link"
          >
            Go Back
          </Button>

          <div className={styles.focus}>
            <div className={styles.title}>
              <Tag className={styles.clinicTag} label="Clinic" type="color" />
              <h1 id="working-hours-title">Set Working hours</h1>
              <p>Set when the clinic staff are typically available for meetings</p>
            </div>

            <div className={styles.schedule}>
              {dayDefinitions.map(({ name, initial }) => (
                <DayRow
                  addSlot={() => addSlot(name)}
                  copyToAllDays={() => copyToAllDays(name)}
                  day={name}
                  initial={initial}
                  key={name}
                  removeSlot={(id) => removeSlot(name, id)}
                  slots={hours[name]}
                  updateSlot={(id, field, value) => updateSlot(name, id, field, value)}
                />
              ))}
            </div>
          </div>

          <Button
            className={styles.continueButton}
            disabled={isSubmitting}
            onClick={submit}
            state={isSubmitting ? "disabled" : "enabled"}
            trailingIcon={<Image alt="" height={14} src="/icons/auth/arrow-right.svg" width={14} />}
            variant="primary"
          >
            Continue
          </Button>
        </div>

        <CalendarPreview />
      </section>
    </main>
  );
}

type DayRowProps = {
  addSlot: () => void;
  copyToAllDays: () => void;
  day: DayName;
  initial: string;
  removeSlot: (id: number) => void;
  slots: TimeSlot[];
  updateSlot: (id: number, field: "start" | "end", value: string) => void;
};

function DayRow({ addSlot, copyToAllDays, day, initial, removeSlot, slots, updateSlot }: DayRowProps) {
  return (
    <div className={styles.dayRow}>
      <span aria-hidden className={styles.dayInitial}>{initial}</span>
      <span className={styles.dayName}>{day}</span>

      <div className={styles.dayTimes}>
        {slots.length === 0 ? <span className={styles.unavailable}>Unavailable</span> : slots.map((slot) => (
          <div className={styles.slot} key={slot.id}>
            <TimeSelect
              label={`${day} start time`}
              onChange={(value) => updateSlot(slot.id, "start", value)}
              value={slot.start}
            />
            <span aria-hidden>-</span>
            <TimeSelect
              label={`${day} end time`}
              onChange={(value) => updateSlot(slot.id, "end", value)}
              value={slot.end}
            />
          </div>
        ))}
      </div>

      <div className={styles.dayActions}>
        {slots.length ? (
          <IconAction label={`Remove ${day} hours`} onClick={() => removeSlot(slots[slots.length - 1].id)} src="/icons/working-hours/remove.svg" />
        ) : null}
        <IconAction label={`Add ${day} hours`} onClick={addSlot} src="/icons/working-hours/plus.svg" />
        {slots.length ? (
          <IconAction label={`Copy ${day} hours to all days`} onClick={copyToAllDays} src="/icons/working-hours/copy.svg" />
        ) : null}
      </div>
    </div>
  );
}

function TimeSelect({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = timeOptions.indexOf(value);
  const menuStart = Math.max(0, Math.min(selectedIndex - 1, timeOptions.length - 7));
  const visibleOptions = timeOptions.slice(menuStart, menuStart + 7);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className={styles.timeSelect} ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className={styles.timeTrigger}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span>{value}</span>
      </button>
      {open ? (
        <div aria-label={`${label} options`} className={styles.timeMenu} role="listbox">
          {visibleOptions.map((time) => (
            <button
              aria-selected={time === value}
              className={time === value ? styles.selectedTime : ""}
              key={time}
              onClick={() => { onChange(time); setOpen(false); }}
              role="option"
              type="button"
            >
              {time}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function IconAction({ label, onClick, src }: { label: string; onClick: () => void; src: string }) {
  return (
    <button aria-label={label} className={styles.iconAction} onClick={onClick} type="button">
      <Image alt="" height={14} src={src} width={14} />
    </button>
  );
}

const appointments = [
  { avatar: 1, color: "cyan", column: 1, height: 44, name: "Ned DeShawn", offset: 8.5, row: 1, time: "10 am - 10:15 am" },
  { avatar: 2, color: "mint", column: 2, height: 97, name: "Elena Voss", offset: 58.5, row: 1, time: "7:45 am - 9:30 am" },
  { avatar: 3, color: "indigo", column: 1, height: 44, name: "Maya Trent", offset: 58.5, row: 2, time: "4 pm - 5 pm" },
  { avatar: 4, color: "yellow", column: 1, height: 44, name: "Ethan Rios", offset: 8.5, row: 3, time: "4 pm - 5 pm" },
  { avatar: 5, color: "indigo", column: 2, height: 44, name: "Gavin Cross", offset: 108.5, row: 3, time: "4 pm - 5 pm" },
] as const;

const previewDates = [
  ["MON", "6"], ["TUE", "7"], ["WED", "8"], ["THU", "9"], ["FRI", "10"], ["SAT", "11"],
] as const;

const previewHours = ["9 am", "10 am", "11 am", "12 pm", "1 pm"];

function CalendarPreview() {
  return (
    <aside aria-label="Working hours calendar preview" className={styles.previewPanel}>
      <div className={styles.browserFrame}>
        <div className={styles.browserBar}>
          <div aria-hidden className={styles.browserActions}>
            <div className={styles.browserNavigation}>
              <span className={styles.browserControl}><Image alt="" height={9} src="/icons/auth/profile-browser-back.svg" width={11} /></span>
              <span className={styles.browserControl}><Image alt="" height={9} src="/icons/auth/profile-browser-forward.svg" width={11} /></span>
            </div>
            <span className={styles.browserControl}><Image alt="" height={11} src="/icons/auth/profile-reload.svg" width={12} /></span>
          </div>
          <div className={styles.address}>mqt.com/ur-jck-fowler-716eu7</div>
        </div>

        <div className={styles.scheduleTable}>
          <div className={styles.weekRow}>
            <span className={styles.timezone}>GMT +5:30</span>
            {previewDates.map(([day, date]) => (
              <span className={date === "7" ? styles.activeDate : ""} key={`${day}-${date}`}>
                <small>{day}</small><b>{date}</b>
              </span>
            ))}
          </div>
          {previewHours.map((time) => (
            <div className={styles.hourRow} key={time}>
              <span className={styles.hour}>{time}</span>
              {previewDates.map(([day, date]) => <span aria-hidden className={styles.dateCell} key={`${time}-${day}-${date}`} />)}
            </div>
          ))}
          {appointments.map((appointment) => (
            <article
              className={`${styles.appointment} ${styles[appointment.color]}`}
              key={appointment.name}
              style={{
                "--appointment-column": appointment.column,
                "--appointment-height": `${appointment.height}px`,
                "--appointment-offset": `${appointment.offset}px`,
                "--appointment-row": appointment.row,
              } as CSSProperties}
            >
              <Image alt="" height={32} src={`/images/working-hours/avatar-${appointment.avatar}.png`} width={32} />
              <span><strong>{appointment.name}</strong><small>{appointment.time}</small></span>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
