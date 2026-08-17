"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { Button } from "@/components/Button";
import {
  createDefaultWorkingHours,
  WeeklyHoursEditor,
  type WorkingHours,
} from "@/components/Scheduling/WeeklyHoursEditor";
import { Tag } from "@/components/Tag";
import styles from "./WorkingHoursScreen.module.css";

export type { WorkingHours } from "@/components/Scheduling/WeeklyHoursEditor";

export type WorkingHoursScreenProps = {
  onContinue?: (hours: WorkingHours) => void | Promise<void>;
};

export function WorkingHoursScreen({ onContinue }: WorkingHoursScreenProps) {
  const router = useRouter();
  const [hours, setHours] = useState<WorkingHours>(createDefaultWorkingHours);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

            <WeeklyHoursEditor onChange={setHours} value={hours} />
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
