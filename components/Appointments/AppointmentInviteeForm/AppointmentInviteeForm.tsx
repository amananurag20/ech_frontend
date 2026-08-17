"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Toggle } from "@/components/Toggle";
import styles from "./AppointmentInviteeForm.module.css";

type QuestionTone = "email" | "longText" | "text";
type QuestionState = "hidden" | "optional" | "required";

type InviteeQuestion = {
  description: string;
  id: string;
  muted?: boolean;
  state: QuestionState;
  title: string;
  tone: QuestionTone;
  type: string;
};

const initialQuestions: InviteeQuestion[] = [
  { id: "full-name", title: "Full Name", description: "Your name", type: "Text", tone: "text", state: "required" },
  { id: "contact", title: "Contact Information", description: "Email address", type: "Email", tone: "email", state: "required" },
  { id: "complaint", title: "Chief Complaint (CC)", description: "Reason for visit, Symptoms", type: "Text", tone: "text", state: "required" },
  { id: "notes", title: "Additional notes", description: "Max 1000 char.", type: "Long Text", tone: "longText", state: "optional" },
  { id: "reschedule", title: "Reason for reschedule", description: "Max 1000 char.", type: "Long Text", tone: "longText", state: "hidden", muted: true },
];

function DragHandle() {
  return (
    <span aria-hidden className={styles.dragHandle}>
      {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
    </span>
  );
}

function QuestionRow({ question }: { question: InviteeQuestion }) {
  return (
    <button className={`${styles.questionRow} ${question.muted ? styles.mutedRow : ""}`} type="button">
      <span className={styles.dragColumn}><DragHandle /></span>
      <span className={styles.questionCopy}>
        <strong>{question.title}</strong>
        <small>{question.description}</small>
      </span>
      <span className={styles.questionMeta}>
        <span className={`${styles.typeTag} ${styles[question.tone]}`}>{question.type}</span>
        <span className={`${styles.stateTag} ${styles[question.state]}`}>
          {question.state.charAt(0).toUpperCase() + question.state.slice(1)}
        </span>
        <Image alt="" className={styles.rowCaret} height={14} src="/icons/appointments/editor/caret.svg" width={14} />
      </span>
    </button>
  );
}

function PatientFormPreview() {
  return (
    <aside aria-label="Patient invite form preview" className={styles.previewPanel} inert>
      <div className={styles.previewShell}>
        <form className={styles.previewForm}>
          <label className={styles.previewField}>
            <span>Your Name</span>
            <input placeholder="Enter your full name" readOnly />
          </label>
          <label className={styles.previewField}>
            <span>Email</span>
            <input placeholder="Enter your email address" readOnly />
          </label>

          <span className={styles.formDivider} />

          <section className={styles.complaintGroup}>
            <h3>Chief Complaint (CC)</h3>
            <label className={styles.previewField}>
              <span>Reason for visit</span>
              <input aria-label="Reason for visit" readOnly />
            </label>
            <label className={styles.previewField}>
              <span>Symptoms</span>
              <span className={styles.selectPreview}>
                <span>Mention your symptoms</span>
                <Image alt="" height={14} src="/icons/booking/caret-up-down.svg" width={14} />
              </span>
            </label>
          </section>

          <span className={styles.formDivider} />

          <label className={styles.previewField}>
            <span>Additional notes</span>
            <textarea placeholder="if you anything else to add..." readOnly />
          </label>

          <div className={styles.previewActions}>
            <Button variant="bordered">Cancel</Button>
            <Button
              trailingIcon={<Image alt="" height={14} src="/icons/appointments/modal/arrow-right.svg" width={14} />}
              variant="neutral"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </aside>
  );
}

export function AppointmentInviteeForm() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [inviteeGuests, setInviteeGuests] = useState(true);

  const addQuestion = () => {
    const nextNumber = questions.length + 1;
    setQuestions((current) => [
      ...current,
      {
        description: "Add a prompt",
        id: `question-${nextNumber}`,
        state: "optional",
        title: "New question",
        tone: "text",
        type: "Text",
      },
    ]);
  };

  return (
    <div className={styles.inviteeLayout}>
      <section className={styles.questionPanel}>
        <header className={styles.panelHeader}>
          <h2>Invitee details</h2>
          <p>Collect name and contact details of the patients</p>
        </header>

        <div className={styles.questionList}>
          {questions.map((question) => <QuestionRow key={question.id} question={question} />)}
          <div className={styles.guestRow}>
            <span className={styles.dragColumn} />
            <span className={styles.questionCopy}>
              <strong>Invitee guests</strong>
              <small>Allow invitees to add guests</small>
            </span>
            <Toggle aria-label="Allow invitees to add guests" checked={inviteeGuests} onCheckedChange={setInviteeGuests} />
          </div>
        </div>

        <Button className={styles.addQuestion} leadingIcon onClick={addQuestion} variant="bordered">
          Add question
        </Button>
      </section>

      <PatientFormPreview />
    </div>
  );
}
