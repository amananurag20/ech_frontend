"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "./PatientBookingDateScreen.module.css";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
const timeSlots12 = ["9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am", "12:00 pm", "12:30 pm", "1:00 pm"];
const timeSlots24 = ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"];

type CalendarDay = {
  date: number;
  key: string;
  leading: boolean;
};

function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: CalendarDay[] = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    days.push({ date: 0, key: `leading-${index}`, leading: true });
  }

  for (let date = 1; date <= daysInMonth; date += 1) {
    days.push({ date, key: `${year}-${month}-${date}`, leading: false });
  }

  while (days.length % 7 !== 0) {
    days.push({ date: 0, key: `trailing-${days.length}`, leading: true });
  }

  return days;
}

export function PatientBookingDateScreen() {
  const router = useRouter();
  const [visibleMonth, setVisibleMonth] = useState(new Date(2026, 6, 1));
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(2);
  const [timeFormat, setTimeFormat] = useState<"12" | "24">("12");
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const calendarDays = useMemo(() => buildCalendarDays(year, month), [month, year]);
  const timeSlots = timeFormat === "12" ? timeSlots12 : timeSlots24;

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/patient/new-booking");
  };

  const changeMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setSelectedDate(0);
  };

  return (
    <main className={styles.page}>
      <div className={styles.pageFrame}>
        <nav aria-label="Booking navigation" className={styles.navigation}>
          <button className={styles.backButton} onClick={goBack} type="button">
            <Image alt="" height={10} src="/icons/booking/date/back.svg" width={12} />
            <span>Go Back</span>
          </button>
          <Image alt="MedQT" height={22} priority src="/icons/booking/date/medqt.svg" width={90} />
        </nav>

        <section
          aria-label="Select an appointment date"
          className={`${styles.appointmentPanel} ${selectedDate ? styles.selectedLayout : ""}`}
        >
          <article className={styles.appointmentSummary}>
            <div className={styles.summaryDetails}>
              <div className={styles.doctorRow}>
                <div className={styles.avatar}>
                  <Image
                    alt="Dr. Giana Hart"
                    className={styles.avatarImage}
                    fill
                    sizes="40px"
                    src="/images/booking/date/doctor-avatar.png"
                  />
                </div>
                <div className={styles.doctorCopy}>
                  <h1>Dr. Giana Hart</h1>
                  <p>Cardiologist</p>
                </div>
              </div>
              <h2>Pre-Operative</h2>
            </div>

            <div className={styles.summaryMetadata}>
              <div className={styles.metadataLeft}>
                <span className={styles.metadataItem}>
                  <Image alt="" height={13} src="/icons/booking/date/clock.svg" width={13} />
                  30m
                </span>
                <span className={styles.metadataItem}>
                  <Image alt="" height={13} src="/icons/booking/date/globe.svg" width={13} />
                  Asia/Singapore
                  <Image alt="" height={5} src="/icons/booking/date/caret.svg" width={10} />
                </span>
              </div>
              <span className={styles.metadataItem}>
                <Image alt="" height={14} src="/icons/booking/date/location.svg" width={11} />
                Medical Clinic
              </span>
            </div>
          </article>

          <div className={styles.setAppointment}>
            <section className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <button aria-label="Previous month" onClick={() => changeMonth(-1)} type="button">
                  <Image alt="" height={10} src="/icons/booking/date/previous.svg" width={6} />
                </button>
                <h2>
                  {monthFormatter.format(visibleMonth)} <span>{year}</span>
                </h2>
                <button aria-label="Next month" onClick={() => changeMonth(1)} type="button">
                  <Image alt="" height={10} src="/icons/booking/date/next.svg" width={6} />
                </button>
              </div>

              <div className={styles.calendarGrid}>
                {weekdays.map((weekday) => (
                  <div className={styles.weekday} key={weekday}>{weekday}</div>
                ))}
                {calendarDays.map((day) => {
                  if (day.leading) {
                    return <span aria-hidden className={styles.emptyDate} key={day.key} />;
                  }

                  const isFigmaMonth = year === 2026 && month === 6;
                  const isUnavailable = isFigmaMonth && day.date < 7;
                  const isToday = isFigmaMonth && day.date === 7;
                  const isSelected = day.date === selectedDate;

                  return (
                    <button
                      aria-current={isToday ? "date" : undefined}
                      aria-label={`${monthFormatter.format(visibleMonth)} ${day.date}, ${year}`}
                      aria-pressed={isSelected}
                      className={`${styles.dateButton} ${isUnavailable ? styles.unavailable : ""} ${isToday ? styles.today : ""} ${isSelected ? styles.selected : ""}`}
                      disabled={isUnavailable}
                      key={day.key}
                      onClick={() => setSelectedDate(day.date)}
                      type="button"
                    >
                      {day.date}
                    </button>
                  );
                })}
              </div>
            </section>

            {selectedDate ? (
              <aside aria-label="Select appointment time" className={styles.timings}>
                <div className={styles.timingsHeader}>
                  <h2>Select Time</h2>
                  <div aria-label="Time format" className={styles.timeFormatToggle} role="group">
                    <button
                      aria-pressed={timeFormat === "12"}
                      className={timeFormat === "12" ? styles.activeFormat : ""}
                      onClick={() => setTimeFormat("12")}
                      type="button"
                    >
                      12 hr
                    </button>
                    <button
                      aria-pressed={timeFormat === "24"}
                      className={timeFormat === "24" ? styles.activeFormat : ""}
                      onClick={() => setTimeFormat("24")}
                      type="button"
                    >
                      24 hr
                    </button>
                  </div>
                </div>
                <div className={styles.timeList}>
                  {timeSlots.map((time, index) => (
                    <button
                      aria-pressed={index === selectedTimeIndex}
                      className={index === selectedTimeIndex ? styles.selectedTime : ""}
                      key={time}
                      onClick={() => setSelectedTimeIndex(index)}
                      type="button"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </aside>
            ) : null}
          </div>
        </section>

        <footer className={styles.footer}>
          <a href="#cookie-settings">Cookie Settings</a>
          <a href="#privacy-policy">Privacy Policy</a>
        </footer>
      </div>
    </main>
  );
}
