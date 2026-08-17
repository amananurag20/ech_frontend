"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./WeeklyHoursEditor.module.css";

export const dayDefinitions = [
  { name: "Sunday", initial: "S" },
  { name: "Monday", initial: "M" },
  { name: "Tuesday", initial: "T" },
  { name: "Wednesday", initial: "W" },
  { name: "Thursday", initial: "T" },
  { name: "Friday", initial: "F" },
  { name: "Saturday", initial: "S" },
] as const;

export type DayName = (typeof dayDefinitions)[number]["name"];
export type TimeSlot = { id: number; start: string; end: string };
export type WorkingHours = Record<DayName, TimeSlot[]>;

const timeOptions = Array.from({ length: 45 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 15;
  const hour24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
});

export function createDefaultWorkingHours(): WorkingHours {
  return Object.fromEntries(
    dayDefinitions.map(({ name }) => [
      name,
      name === "Sunday" || name === "Saturday" ? [] : [{ id: 1, start: "9:00 am", end: "5:00 pm" }],
    ]),
  ) as WorkingHours;
}

type WeeklyHoursEditorProps = {
  className?: string;
  onChange: (hours: WorkingHours) => void;
  value: WorkingHours;
};

export function WeeklyHoursEditor({ className = "", onChange, value }: WeeklyHoursEditorProps) {
  const addSlot = (day: DayName) => {
    onChange({
      ...value,
      [day]: [...value[day], { id: Date.now(), start: "9:00 am", end: "5:00 pm" }],
    });
  };

  const removeSlot = (day: DayName, id: number) => {
    onChange({ ...value, [day]: value[day].filter((slot) => slot.id !== id) });
  };

  const updateSlot = (day: DayName, id: number, field: "start" | "end", nextValue: string) => {
    onChange({
      ...value,
      [day]: value[day].map((slot) => slot.id === id ? { ...slot, [field]: nextValue } : slot),
    });
  };

  const copyToAllDays = (sourceDay: DayName) => {
    const source = value[sourceDay];
    onChange(Object.fromEntries(dayDefinitions.map(({ name }, dayIndex) => [
      name,
      source.map((slot, slotIndex) => ({ ...slot, id: Date.now() + dayIndex * 10 + slotIndex })),
    ])) as WorkingHours);
  };

  return (
    <div className={`${styles.schedule} ${className}`}>
      {dayDefinitions.map(({ name, initial }) => (
        <div className={styles.dayRow} key={name}>
          <span aria-hidden className={`${styles.dayInitial} ${value[name].length === 0 ? styles.disabledDay : ""}`}>{initial}</span>
          <span className={styles.dayName}>{name}</span>

          <div className={styles.dayTimes}>
            {value[name].length === 0 ? <span className={styles.unavailable}>Unavailable</span> : value[name].map((slot) => (
              <div className={styles.slot} key={slot.id}>
                <TimeSelect
                  label={`${name} start time`}
                  onChange={(nextValue) => updateSlot(name, slot.id, "start", nextValue)}
                  value={slot.start}
                />
                <span aria-hidden>-</span>
                <TimeSelect
                  label={`${name} end time`}
                  onChange={(nextValue) => updateSlot(name, slot.id, "end", nextValue)}
                  value={slot.end}
                />
              </div>
            ))}
          </div>

          <div className={styles.dayActions}>
            {value[name].length ? (
              <IconAction label={`Remove ${name} hours`} onClick={() => removeSlot(name, value[name][value[name].length - 1].id)} src="/icons/working-hours/remove.svg" />
            ) : null}
            <IconAction label={`Add ${name} hours`} onClick={() => addSlot(name)} src="/icons/working-hours/plus.svg" />
            {value[name].length ? (
              <IconAction label={`Copy ${name} hours to all days`} onClick={() => copyToAllDays(name)} src="/icons/working-hours/copy.svg" />
            ) : null}
          </div>
        </div>
      ))}
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
      <button aria-expanded={open} aria-haspopup="listbox" aria-label={label} className={styles.timeTrigger} onClick={() => setOpen((current) => !current)} type="button">
        {value}
      </button>
      {open ? (
        <div aria-label={`${label} options`} className={styles.timeMenu} role="listbox">
          {visibleOptions.map((time) => (
            <button aria-selected={time === value} className={time === value ? styles.selectedTime : ""} key={time} onClick={() => { onChange(time); setOpen(false); }} role="option" type="button">
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
