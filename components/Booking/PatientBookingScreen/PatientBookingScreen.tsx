"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Tag } from "@/components/Tag";
import styles from "./PatientBookingScreen.module.css";

export type PatientBookingFormValues = {
  additionalNotes: string;
  email: string;
  name: string;
  reasonForVisit: string;
  symptoms: string;
};

export type PatientBookingScreenProps = {
  onCreate?: (values: PatientBookingFormValues) => void | Promise<void>;
};

const symptoms = [
  "Chest pain",
  "Shortness of breath",
  "Palpitations",
  "Fatigue",
  "Dizziness",
  "Other",
];

const initialValues: PatientBookingFormValues = {
  additionalNotes: "",
  email: "",
  name: "",
  reasonForVisit: "",
  symptoms: "",
};

export function PatientBookingScreen({ onCreate }: PatientBookingScreenProps) {
  const router = useRouter();
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState(initialValues);

  const updateValue = (field: keyof PatientBookingFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onCreate) {
      router.push("/patient/new-booking/date");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.pageFrame}>
        <nav aria-label="Booking navigation" className={styles.navigation}>
          <button className={styles.backButton} onClick={goBack} type="button">
            <Image alt="" height={10} src="/icons/booking/back.svg" width={12} />
            <span>Go Back</span>
          </button>
          <Image
            alt="MedQT"
            className={styles.wordmark}
            height={22}
            priority
            src="/icons/booking/medqt.svg"
            width={90}
          />
        </nav>

        <section aria-label="Create an appointment" className={styles.glassCard}>
          <div className={styles.profileColumn}>
            <article className={styles.doctorCard}>
              <Image
                alt="Dr. Giana Hart"
                className={styles.doctorImage}
                fill
                priority
                sizes="(max-width: 720px) 100vw, 380px"
                src="/images/booking/dr-giana-hart.png"
              />
              <div aria-hidden className={styles.doctorGradient} />
              <div className={styles.doctorIdentity}>
                <h1>Dr. Giana Hart</h1>
                <p>Cardiologist</p>
              </div>
            </article>

            <article className={styles.briefCard}>
              <div>
                <h2>Brief</h2>
                <p className={styles.collapsedBrief}>
                  Dr. Giana Hart is a board-certified cardiologist specializing in preventive
                  cardiology, lipid management, and hypertension. She works with patients to
                  build clear, practical care plans for long-term heart health.
                </p>
                <button
                  aria-haspopup="dialog"
                  className={styles.moreButton}
                  onClick={() => setIsBriefOpen(true)}
                  type="button"
                >
                  more
                </button>
              </div>
              <div aria-label="Specialties" className={styles.tags}>
                {['Physician', 'Lipids', 'Cardiology', 'Hypertension'].map((tag) => (
                  <Tag key={tag} label={tag} type="color" />
                ))}
              </div>
            </article>
          </div>

          <form className={styles.formCard} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label htmlFor="booking-name">Your Name</label>
              <input
                autoComplete="name"
                id="booking-name"
                onChange={(event) => updateValue("name", event.target.value)}
                placeholder="Enter your full name"
                required
                type="text"
                value={values.name}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="booking-email">Email</label>
              <input
                autoComplete="email"
                id="booking-email"
                onChange={(event) => updateValue("email", event.target.value)}
                placeholder="Enter your email address"
                required
                type="email"
                value={values.email}
              />
            </div>

            <div className={styles.divider} />

            <div className={styles.complaintSection}>
              <p className={styles.sectionLabel}>Chief Complaint (CC)</p>
              <div className={styles.fieldGroup}>
                <label htmlFor="booking-reason">Reason for visit</label>
                <input
                  id="booking-reason"
                  onChange={(event) => updateValue("reasonForVisit", event.target.value)}
                  required
                  type="text"
                  value={values.reasonForVisit}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="booking-symptoms">Symptoms</label>
                <select
                  className={values.symptoms ? styles.selectValue : styles.selectPlaceholder}
                  id="booking-symptoms"
                  onChange={(event) => updateValue("symptoms", event.target.value)}
                  required
                  value={values.symptoms}
                >
                  <option disabled value="">Mention your symptoms</option>
                  {symptoms.map((symptom) => (
                    <option key={symptom} value={symptom}>{symptom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.fieldGroup}>
              <label htmlFor="booking-notes">Additional notes</label>
              <textarea
                id="booking-notes"
                onChange={(event) => updateValue("additionalNotes", event.target.value)}
                placeholder="if you anything else to add..."
                value={values.additionalNotes}
              />
            </div>

            <div className={styles.actions}>
              <Button onClick={goBack} variant="bordered">Cancel</Button>
              <Button
                disabled={isSubmitting}
                trailingIcon={
                  isSubmitting ? (
                    <span aria-hidden className={styles.spinner} />
                  ) : (
                    <Image alt="" height={9} src="/icons/booking/arrow-right.svg" width={11} />
                  )
                }
                type="submit"
                variant="neutral"
              >
                Create
              </Button>
            </div>
          </form>
        </section>

        <footer className={styles.footer}>
          <a href="#cookie-settings">Cookie Settings</a>
          <a href="#privacy-policy">Privacy Policy</a>
        </footer>
      </div>

      <Modal ariaLabel="Doctor brief" isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)}>
        <div className={styles.briefModal}>
          <div className={styles.briefModalContent}>
            <div className={styles.briefModalCopy}>
              <h2>Brief</h2>
              <p>
                Dr. Giana Hart brings over a decade of expertise in advanced cardiovascular
                care and comprehensive internal medicine. She provides a holistic approach to
                patient health, managing everyday primary care needs while specializing in the
                prevention, diagnosis, and treatment of complex heart conditions.
              </p>
              <p>
                At MedQT Care, she provides a holistic approach to patient health, managing
                everyday wellness needs while specializing in the prevention, diagnosis, and
                treatment of complex heart conditions.
              </p>
            </div>
            <Image
              alt=""
              className={styles.briefDivider}
              height={1}
              src="/icons/booking/brief-divider.svg"
              width={376}
            />
            <div aria-label="Doctor specialties" className={styles.tags}>
              {['Physician', 'Lipids', 'Cardiology', 'Hypertension'].map((tag) => (
                <Tag key={tag} label={tag} type="color" />
              ))}
            </div>
          </div>
          <div className={styles.briefModalActions}>
            <Button onClick={() => setIsBriefOpen(false)} variant="bordered">Close</Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
