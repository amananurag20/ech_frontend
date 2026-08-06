"use client";

import Image from "next/image";
import { useMemo } from "react";
import styles from "./AppointmentCalendar.module.css";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

type CalendarDay = { date: number; key: string; placeholder: boolean };

function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: CalendarDay[] = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    days.push({ date: 0, key: `leading-${index}`, placeholder: true });
  }
  for (let date = 1; date <= daysInMonth; date += 1) {
    days.push({ date, key: `${year}-${month}-${date}`, placeholder: false });
  }
  while (days.length % 7 !== 0) {
    days.push({ date: 0, key: `trailing-${days.length}`, placeholder: true });
  }
  return days;
}

export type AppointmentCalendarProps = {
  className?: string;
  compact?: boolean;
  isDateDisabled?: (date: number) => boolean;
  month: number;
  onMonthChange?: (offset: number) => void;
  onSelectDate: (date: number) => void;
  selectedDate: number;
  todayDate?: number;
  year: number;
};

export function AppointmentCalendar({
  className = "",
  compact = false,
  isDateDisabled,
  month,
  onMonthChange,
  onSelectDate,
  selectedDate,
  todayDate,
  year,
}: AppointmentCalendarProps) {
  const days = useMemo(() => buildCalendarDays(year, month), [month, year]);
  const monthName = monthFormatter.format(new Date(year, month, 1));

  return (
    <section className={`${styles.calendar} ${compact ? styles.compact : ""} ${className}`}>
      <div className={styles.calendarHeader}>
        <button aria-label="Previous month" onClick={() => onMonthChange?.(-1)} type="button">
          <Image alt="" height={10} src="/icons/booking/date/previous.svg" width={6} />
        </button>
        <h2>{monthName} <span>{year}</span></h2>
        <button aria-label="Next month" onClick={() => onMonthChange?.(1)} type="button">
          <Image alt="" height={10} src="/icons/booking/date/next.svg" width={6} />
        </button>
      </div>
      <div className={styles.calendarGrid}>
        {weekdays.map((weekday) => <span className={styles.weekday} key={weekday}>{weekday}</span>)}
        {days.map((day) => {
          if (day.placeholder) return <span aria-hidden className={styles.emptyDate} key={day.key} />;
          const disabled = isDateDisabled?.(day.date) ?? false;
          const isToday = day.date === todayDate;
          const isSelected = day.date === selectedDate;
          return (
            <button
              aria-current={isToday ? "date" : undefined}
              aria-label={`${monthName} ${day.date}, ${year}`}
              aria-pressed={isSelected}
              className={`${styles.dateButton} ${disabled ? styles.unavailable : ""} ${isToday ? styles.today : ""} ${isSelected ? styles.selected : ""}`}
              disabled={disabled}
              key={day.key}
              onClick={() => onSelectDate(day.date)}
              type="button"
            >
              {day.date}
            </button>
          );
        })}
      </div>
    </section>
  );
}
