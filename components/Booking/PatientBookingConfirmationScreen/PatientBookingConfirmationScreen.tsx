import Image from "next/image";
import { Button } from "@/components/Button";
import styles from "./PatientBookingConfirmationScreen.module.css";

const fallbackDate = new Date(2026, 6, 30);
const timeSlots = ["9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM"];

type PatientBookingConfirmationScreenProps = {
  date?: string;
  timeIndex?: string;
};

function parseDate(value?: string) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return fallbackDate;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function addMinutes(time: string, minutes: number) {
  const match = time.match(/^(\d+):(\d+)\s(AM|PM)$/);
  if (!match) return time;
  let hours = Number(match[1]) % 12;
  if (match[3] === "PM") hours += 12;
  const value = new Date(2026, 0, 1, hours, Number(match[2]) + minutes);
  return value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function DetailIcon({ name }: { name: "calendar" | "globe" | "location" }) {
  const layers = name === "calendar" ? ["calendar-2", "calendar-1"] : name === "globe" ? ["globe-1", "globe-2"] : ["location-1", "location-2"];
  return (
    <span aria-hidden className={`${styles.detailIcon} ${styles[name]}`}>
      {layers.map((layer) => (
        <Image alt="" className={styles[layer]} height={20} key={layer} src={`/icons/booking/confirmation/${layer}.svg`} width={20} />
      ))}
    </span>
  );
}

export function PatientBookingConfirmationScreen({ date, timeIndex }: PatientBookingConfirmationScreenProps) {
  const appointmentDate = parseDate(date);
  const parsedIndex = Number(timeIndex);
  const hasSelectedTime = Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < timeSlots.length;
  const startTime = hasSelectedTime ? timeSlots[parsedIndex] : "2:30 PM";
  const endTime = hasSelectedTime ? addMinutes(startTime, 30) : "2:45 PM";
  const weekday = appointmentDate.toLocaleDateString("en-US", { weekday: "long" });
  const month = appointmentDate.toLocaleDateString("en-US", { month: "long" });
  const formattedDate = `${weekday} ${month} ${appointmentDate.getDate()}, ${appointmentDate.getFullYear()}`;

  return (
    <main className={styles.page}>
      <section aria-label="Appointment confirmation" className={styles.receipt}>
        <header className={styles.successBanner}>
          <span className={styles.successIcon}>
            <Image alt="" height={51} src="/icons/booking/confirmation/success.svg" width={56} />
          </span>
          <div>
            <h1>The Appointment is scheduled</h1>
            <p>You will be notified via mail prior to the meeting</p>
          </div>
        </header>

        <article className={styles.detailsCard}>
          <div className={styles.doctorSection}>
            <h2>Pre-Operative Meeting</h2>
            <div className={styles.doctorRow}>
              <span className={styles.avatar}>
                <Image alt="Dr. Giana Hart" fill sizes="64px" src="/images/booking/confirmation/doctor.png" />
              </span>
              <div>
                <h3>Dr. Giana Hart</h3>
                <p>Cardiologist</p>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.schedule}>
            <div className={styles.detailRow}>
              <DetailIcon name="calendar" />
              <p>{formattedDate} <strong>@{startTime} - {endTime}</strong></p>
            </div>
            <div className={styles.detailRow}>
              <DetailIcon name="globe" />
              <p>Asia/Singapore (GMT+8)</p>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.detailRow}>
            <DetailIcon name="location" />
            <p>Medical Clinic</p>
          </div>

          <div className={styles.actions}>
            <Button variant="neutral">Visit Us</Button>
            <Button variant="bordered">See Doctor</Button>
          </div>
        </article>
      </section>
    </main>
  );
}
