"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import styles from "./RequestAccessModal.module.css";

export type RequestAccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const REQUEST_LINK = "mdt.com/s0sdasnjkas 0012/req_611";
const accessItems = [
  "Shared Documents",
  "Activity Timeline",
  "Patient Document History",
  "Patient EHR Summary",
];

export function RequestAccessModal({ isOpen, onClose }: RequestAccessModalProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const closeModal = () => {
    setExpanded(false);
    setCopied(false);
    onClose();
  };

  const copyLink = async () => {
    await navigator.clipboard?.writeText(REQUEST_LINK);
    setCopied(true);
  };

  return (
    <Modal ariaLabel="Request Full history" className={styles.dialog} isOpen={isOpen} onClose={closeModal}>
      <header className={styles.header}>
        <div>
          <h2>Request Full history</h2>
          <p>Patient will be notified of the request through MedQT notification or share them the request link</p>
        </div>
        <button aria-label="Close request access dialog" className={styles.closeButton} onClick={closeModal} type="button">
          <Image alt="" height={16} src="/icons/appointments/modal/close-1.svg" width={16} />
          <Image alt="" height={16} src="/icons/appointments/modal/close-2.svg" width={16} />
        </button>
      </header>

      <div className={styles.divider} />

      <label className={styles.linkField}>
        <span>Request Link</span>
        <span className={styles.linkValue}>
          <span>{REQUEST_LINK}</span>
          <button aria-label="Copy request link" onClick={copyLink} type="button">
            <span aria-hidden className={copied ? styles.copiedIcon : styles.copyIcon}>{copied ? "✓" : ""}</span>
          </button>
        </span>
      </label>

      <section className={`${styles.accessInfo} ${expanded ? styles.accessInfoExpanded : ""}`}>
        <button aria-expanded={expanded} className={styles.accessToggle} onClick={() => setExpanded((value) => !value)} type="button">
          <span>Know about full access</span>
          <span aria-hidden className={styles.caret}>›</span>
        </button>
        {expanded ? (
          <div className={styles.accessDetails}>
            <p>You’ll be able to see complete medical history of the patient available on MedQT App</p>
            <ul>
              {accessItems.map((item) => (
                <li key={item}><span>{item}</span><i>✓</i></li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <div className={styles.actions}>
        <Button onClick={closeModal} variant="bordered">Cancel</Button>
        <Button onClick={closeModal} variant="primary">Send Request</Button>
      </div>
      <span aria-live="polite" className={styles.copyStatus}>{copied ? "Request link copied" : ""}</span>
    </Modal>
  );
}
