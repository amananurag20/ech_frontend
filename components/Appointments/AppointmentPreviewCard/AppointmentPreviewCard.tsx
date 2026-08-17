import Image from "next/image";
import { Tag } from "@/components/Tag";
import styles from "./AppointmentPreviewCard.module.css";

export type AppointmentPreviewCardProps = {
  duration: number;
  location?: string;
  timeZone?: string;
  title: string;
  tone?: "dark" | "muted";
};

export function AppointmentPreviewCard({
  duration,
  location = "Medical Clinic",
  timeZone = "Asia/Singapore",
  title,
  tone = "dark",
}: AppointmentPreviewCardProps) {
  return (
    <article className={`${styles.card} ${tone === "muted" ? styles.muted : ""}`}>
      <div className={styles.leftColumn}>
        <div className={styles.details}>
          <div className={styles.doctor}>
            <span className={styles.avatarFrame}>
              <Image alt="Dr. Giana Hart" fill sizes="40px" src="/images/booking/date/doctor-avatar.png" />
            </span>
            <span className={styles.doctorInfo}>
              <strong>Dr. Giana Hart</strong>
              <small>Cardiologist</small>
            </span>
          </div>
          <h2>{title}</h2>
        </div>
        <div className={styles.leftTags}>
          <Tag className={styles.previewTag} label={`${duration}m`} leadingIcon={<Image alt="" height={13} src="/icons/appointments/preview/clock.svg" width={13} />} />
          <Tag className={`${styles.previewTag} ${styles.locationTag}`} label={location} leadingIcon={<Image alt="" height={14} src="/icons/appointments/preview/location.svg" width={11} />} />
        </div>
      </div>
      <Tag
        className={`${styles.previewTag} ${styles.timeZoneTag}`}
        label={timeZone}
        leadingIcon={<Image alt="" height={13} src="/icons/booking/date/globe.svg" width={13} />}
        trailingIcon={<Image alt="" height={6} src="/icons/booking/date/caret.svg" width={10} />}
      />
    </article>
  );
}
