"use client";

import Image from "next/image";
import { useState } from "react";
import { AppointmentCalendar } from "@/components/Calendar/AppointmentCalendar";
import {
  createDefaultWorkingHours,
  WeeklyHoursEditor,
  type WorkingHours,
} from "@/components/Scheduling/WeeklyHoursEditor";
import { AppointmentPreviewCard } from "../AppointmentPreviewCard";
import styles from "./AppointmentAvailability.module.css";

type AppointmentAvailabilityProps = {
  duration: number;
  title: string;
};

const twelveHourTimes = ["9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am", "12:00 pm", "12:30 pm", "1:00 pm"];

export function AppointmentAvailability({ duration, title }: AppointmentAvailabilityProps) {
  const [hours, setHours] = useState<WorkingHours>(createDefaultWorkingHours);

  return (
    <div className={styles.availabilityGrid}>
      <section aria-labelledby="weekly-hours-heading" className={styles.hoursPanel}>
        <header className={styles.hoursHeader}>
          <div className={styles.hoursCopy}>
            <h2 id="weekly-hours-heading">Weekly Hours <Image alt="" height={6} src="/icons/navigation/caret.svg" width={11} /></h2>
            <p>Set the times you are available every day</p>
          </div>
          <span className={styles.timezone}>
            <Image alt="" height={16} src="/icons/booking/date/globe.svg" width={16} />
            Asia/Singapore
            <Image alt="" height={14} src="/icons/booking/caret-up-down.svg" width={14} />
          </span>
        </header>
        <div className={styles.divider} />
        <WeeklyHoursEditor onChange={setHours} value={hours} />
      </section>

      <aside aria-hidden="true" className={styles.previewPanel} inert>
        <div className={styles.previewCard}>
          <AppointmentPreviewCard duration={duration} title={title} tone="muted" />
          <div className={styles.bookingPreview}>
            <div className={styles.calendarPane}>
              <AppointmentCalendar
                className={styles.calendar}
                compact
                month={6}
                onSelectDate={() => undefined}
                selectedDate={16}
                todayDate={7}
                year={2026}
              />
            </div>
            <section className={styles.timePane}>
              <header>
                <h3>Select Time</h3>
                <span className={styles.clockToggle}>
                  <span className={styles.activeClock}>12 hr</span>
                  <span>24 hr</span>
                </span>
              </header>
              <div className={styles.timeList}>
                {twelveHourTimes.map((time) => (
                  <span key={time}>{time}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}
