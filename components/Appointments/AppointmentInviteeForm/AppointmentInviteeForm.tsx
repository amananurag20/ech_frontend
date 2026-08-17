"use client";

import Image from "next/image";
import type { DragEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Toggle } from "@/components/Toggle";
import styles from "./AppointmentInviteeForm.module.css";

type InputType = "Checkbox" | "Dropdown" | "Email" | "Long Text" | "Name" | "Radio" | "Text";
type QuestionState = "hidden" | "optional" | "required";

type InviteeQuestion = {
  description: string;
  id: string;
  label: string;
  options?: string[];
  placeholder: string;
  state: QuestionState;
  title: string;
  type: InputType;
};

const initialQuestions: InviteeQuestion[] = [
  { description: "Your name", id: "full-name", label: "Your Name", placeholder: "Enter your full name", state: "required", title: "Full Name", type: "Name" },
  { description: "Email address", id: "contact", label: "Email", placeholder: "Enter your email address", state: "required", title: "Contact Information", type: "Email" },
  { description: "Reason for visit, Symptoms", id: "complaint", label: "Chief Complaint (CC)", placeholder: "Reason for visit", state: "required", title: "Chief Complaint (CC)", type: "Text" },
  { description: "Max 1000 char.", id: "notes", label: "Additional notes", placeholder: "if you anything else to add...", state: "optional", title: "Additional notes", type: "Long Text" },
  { description: "Max 1000 char.", id: "reschedule", label: "Reason for reschedule", placeholder: "Tell us why you need to reschedule", state: "hidden", title: "Reason for reschedule", type: "Long Text" },
];

const typeOptions: InputType[] = ["Name", "Email", "Text", "Long Text", "Dropdown", "Checkbox", "Radio"];

function isChoiceType(type: InputType) {
  return type === "Dropdown" || type === "Checkbox" || type === "Radio";
}

function DragHandle() {
  return <span aria-hidden className={styles.dragHandle}>{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</span>;
}

function typeClass(type: InputType) {
  if (type === "Email") return styles.email;
  if (type === "Name") return styles.name;
  if (type === "Long Text") return styles.longText;
  if (isChoiceType(type)) return styles.choice;
  return styles.text;
}

type QuestionRowProps = {
  dragging: boolean;
  dropTarget: boolean;
  expanded: boolean;
  onChange: (question: InviteeQuestion) => void;
  onDragEnd: () => void;
  onDragEnter: () => void;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
  onToggle: () => void;
  question: InviteeQuestion;
};

function QuestionRow({ dragging, dropTarget, expanded, onChange, onDragEnd, onDragEnter, onDragStart, onDrop, onToggle, question }: QuestionRowProps) {
  const update = <Key extends keyof InviteeQuestion>(key: Key, value: InviteeQuestion[Key]) => {
    const nextQuestion = { ...question, [key]: value };
    if (key === "label" && question.title === question.label) nextQuestion.title = String(value);
    onChange(nextQuestion);
  };

  const updateType = (type: InputType) => {
    onChange({
      ...question,
      options: isChoiceType(type) && !question.options?.length ? ["Option 1", "Option 2"] : question.options,
      type,
    });
  };

  return (
    <section
      className={`${styles.questionRow} ${expanded ? styles.expandedRow : ""} ${question.state === "hidden" ? styles.mutedRow : ""} ${dragging ? styles.draggingRow : ""} ${dropTarget ? styles.dropTargetRow : ""}`}
      draggable
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragStart={onDragStart}
      onDrop={onDrop}
    >
      <span className={styles.dragColumn}><DragHandle /></span>
      <div className={styles.questionBody}>
        <button aria-expanded={expanded} className={styles.questionSummary} onClick={onToggle} type="button">
          <span className={styles.questionCopy}>
            <strong>{question.title}</strong>
            <small>{expanded ? "Customize the question asked for this section" : question.description}</small>
          </span>
          <span className={styles.questionMeta}>
            {expanded ? <span className={styles.editBadge}>Edit</span> : (
              <>
                <span className={`${styles.typeTag} ${typeClass(question.type)}`}>{question.type}</span>
                <span className={`${styles.stateTag} ${styles[question.state]}`}>{question.state.charAt(0).toUpperCase() + question.state.slice(1)}</span>
              </>
            )}
            <Image alt="" className={`${styles.rowCaret} ${expanded ? styles.caretOpen : ""}`} height={14} src="/icons/appointments/editor/caret.svg" width={14} />
          </span>
        </button>

        {expanded ? (
          <div className={styles.questionEditor}>
            <label className={styles.editorField}>
              <span>Input type</span>
              <span className={styles.selectControl}>
                <select onChange={(event) => updateType(event.target.value as InputType)} value={question.type}>
                  {typeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                <Image alt="" height={14} src="/icons/booking/caret-up-down.svg" width={14} />
              </span>
            </label>

            <div className={styles.editorColumns}>
              <label className={styles.editorField}>
                <span>Label</span>
                <input onChange={(event) => update("label", event.target.value)} value={question.label} />
              </label>
              <label className={styles.editorField}>
                <span>Placeholder</span>
                <input onChange={(event) => update("placeholder", event.target.value)} value={question.placeholder} />
              </label>
            </div>

            {isChoiceType(question.type) ? (
              <label className={styles.editorField}>
                <span>Options</span>
                <input
                  aria-label={`${question.title} options`}
                  onChange={(event) => update("options", event.target.value.split(",").map((option) => option.trimStart()))}
                  placeholder="Option 1, Option 2"
                  value={(question.options ?? []).join(", ")}
                />
              </label>
            ) : null}

            <div className={styles.requiredRow}>
              <span>Make this field required</span>
              <Toggle aria-label={`Make ${question.title} required`} checked={question.state === "required"} className={styles.neutralToggle} onCheckedChange={(checked) => update("state", checked ? "required" : "optional")} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PreviewQuestion({ question }: { question: InviteeQuestion }) {
  const label = question.label;
  const options = (question.options ?? []).filter((option) => option.trim().length > 0);

  if (question.type === "Dropdown") {
    return (
      <label className={styles.previewField}>
        <span>{label}</span>
        <span className={styles.dropdownPreview}>
          <span>{question.placeholder || "Select an option"}</span>
          <Image alt="" height={14} src="/icons/booking/caret-up-down.svg" width={14} />
        </span>
      </label>
    );
  }

  if (question.type === "Checkbox" || question.type === "Radio") {
    return (
      <fieldset className={styles.choicePreview}>
        <legend>{label}</legend>
        <div className={styles.choiceOptions}>
          {options.map((option) => (
            <label key={option}>
              <input name={question.id} type={question.type === "Radio" ? "radio" : "checkbox"} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (question.type === "Long Text") {
    return <label className={styles.previewField}><span>{label}</span><textarea placeholder={question.placeholder} readOnly /></label>;
  }

  return <label className={styles.previewField}><span>{label}</span><input placeholder={question.placeholder} readOnly type={question.type === "Email" ? "email" : "text"} /></label>;
}

function PatientFormPreview({ questions }: { questions: InviteeQuestion[] }) {
  const visibleQuestions = questions.filter((question) => question.state !== "hidden");

  return (
    <aside aria-label="Patient invite form preview" className={styles.previewPanel} inert>
      <div className={styles.previewShell}>
        <span aria-hidden className={styles.previewBaseLayer} />
        <span aria-hidden className={styles.previewBlendLayer} />
        <form className={styles.previewForm}>
          {visibleQuestions.map((question, index) => (
            <div className={styles.previewQuestion} key={question.id}>
              {index > 1 ? <span className={styles.formDivider} /> : null}
              <PreviewQuestion question={question} />
            </div>
          ))}
        </form>
        <div className={styles.previewActions}>
          <Button variant="bordered">Cancel</Button>
          <Button trailingIcon={<Image alt="" height={14} src="/icons/appointments/modal/arrow-right.svg" width={14} />} variant="neutral">Create</Button>
        </div>
      </div>
    </aside>
  );
}

export function AppointmentInviteeForm() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [expandedId, setExpandedId] = useState<string | null>("contact");
  const [inviteeGuests, setInviteeGuests] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const updateQuestion = (nextQuestion: InviteeQuestion) => {
    setQuestions((current) => current.map((question) => question.id === nextQuestion.id ? nextQuestion : question));
  };

  const addQuestion = () => {
    const id = `question-${crypto.randomUUID()}`;
    const newQuestion: InviteeQuestion = { description: "Add a prompt", id, label: "New question", placeholder: "Enter your answer", state: "optional", title: "New question", type: "Text" };
    setQuestions((current) => [...current, newQuestion]);
    setExpandedId(id);
  };

  const finishDragging = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  const moveQuestion = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      finishDragging();
      return;
    }

    setQuestions((current) => {
      const fromIndex = current.findIndex((question) => question.id === draggedId);
      const targetIndex = current.findIndex((question) => question.id === targetId);
      if (fromIndex < 0 || targetIndex < 0) return current;

      const nextQuestions = [...current];
      const [movedQuestion] = nextQuestions.splice(fromIndex, 1);
      nextQuestions.splice(targetIndex, 0, movedQuestion);
      return nextQuestions;
    });
    finishDragging();
  };

  return (
    <div className={styles.inviteeLayout}>
      <section className={styles.questionPanel}>
        <header className={styles.panelHeader}><h2>Invitee details</h2><p>Collect name and contact details of the patients</p></header>
        <div className={styles.questionList}>
          {questions.map((question) => (
            <QuestionRow
              dragging={draggedId === question.id}
              dropTarget={dropTargetId === question.id && draggedId !== question.id}
              expanded={expandedId === question.id}
              key={question.id}
              onChange={updateQuestion}
              onDragEnd={finishDragging}
              onDragEnter={() => draggedId && setDropTargetId(question.id)}
              onDragStart={(event) => {
                setDraggedId(question.id);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", question.id);
              }}
              onDrop={(event) => {
                event.preventDefault();
                moveQuestion(question.id);
              }}
              onToggle={() => setExpandedId((current) => current === question.id ? null : question.id)}
              question={question}
            />
          ))}
          <div className={styles.guestRow}>
            <span className={styles.dragColumn} />
            <span className={styles.questionCopy}><strong>Invitee guests</strong><small>Allow invitees to add guests</small></span>
            <Toggle aria-label="Allow invitees to add guests" checked={inviteeGuests} className={styles.neutralToggle} onCheckedChange={setInviteeGuests} />
          </div>
        </div>
        <Button className={styles.addQuestion} leadingIcon onClick={addQuestion} variant="bordered">Add question</Button>
      </section>
      <PatientFormPreview questions={questions} />
    </div>
  );
}
