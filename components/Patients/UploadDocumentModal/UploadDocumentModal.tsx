"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import styles from "./UploadDocumentModal.module.css";

export type UploadDocumentModalProps = {
  defaultRecord?: string;
  existingRecords?: string[];
  isOpen: boolean;
  onAddDocuments?: (files: File[], recordName: string) => void;
  onClose: () => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(?:jpe?g|png)$/i.test(file.name);
}

function FileVisual({ file, view }: { file: File; view: "grid" | "list" }) {
  const [previewUrl] = useState(() => URL.createObjectURL(file));

  useEffect(() => () => URL.revokeObjectURL(previewUrl), [previewUrl]);

  if (isImageFile(file)) {
    return (
      <span
        aria-label={`${file.name} preview`}
        className={view === "grid" ? styles.gridImagePreview : styles.listImagePreview}
        role="img"
        style={{ backgroundImage: `url(${previewUrl})` }}
      />
    );
  }

  if (view === "list") return <span className={styles.pdfIcon}>PDF</span>;

  return (
    <div className={`${styles.documentPreview} ${styles.pdfPreview}`}>
      <b>PDF</b>
      <span /><span /><span /><span /><span />
    </div>
  );
}

export function UploadDocumentModal({
  defaultRecord = "",
  existingRecords = ["Weekly Report", "Renal Doppler Ultrasound"],
  isOpen,
  onAddDocuments,
  onClose,
}: UploadDocumentModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [view, setView] = useState<"grid" | "list">("list");
  const [newRecord, setNewRecord] = useState("");
  const [existingRecord, setExistingRecord] = useState(defaultRecord);

  const closeModal = () => {
    setFiles([]);
    setError("");
    setNewRecord("");
    setExistingRecord(defaultRecord);
    setView("list");
    onClose();
  };

  const acceptFiles = (incoming: File[]) => {
    const validFiles = incoming.filter((file) => ACCEPTED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE);
    setError(validFiles.length === incoming.length ? "" : "Choose PDF, JPG, or PNG files up to 5 MB");
    if (validFiles.length) setFiles((current) => [...current, ...validFiles].slice(0, 20));
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    acceptFiles(Array.from(event.dataTransfer.files ?? []));
  };

  const addToRecord = () => {
    onAddDocuments?.(files, newRecord || existingRecord);
    closeModal();
  };

  return (
    <Modal
      ariaLabel="Upload patient’s document"
      className={`${styles.uploadDialog} ${files.length ? styles.uploadedDialog : ""}`}
      isOpen={isOpen}
      onClose={closeModal}
    >
      <header className={styles.header}>
        <div className={styles.headingCopy}>
          <h2>Upload patient’s document</h2>
          <p>You have <strong>20 file uploads</strong> left this month</p>
        </div>
        <button aria-label="Close upload document dialog" className={styles.closeButton} onClick={closeModal} type="button">
          <Image alt="" height={16} src="/icons/appointments/modal/close-1.svg" width={16} />
          <Image alt="" height={16} src="/icons/appointments/modal/close-2.svg" width={16} />
        </button>
      </header>

      <div className={styles.divider} />

      {files.length ? (
        <>
          <section className={styles.uploadedFiles}>
            <div className={styles.filesToolbar}>
              <button className={styles.addMoreButton} onClick={() => inputRef.current?.click()} type="button">
                <span aria-hidden className={styles.plusIcon} />
                <span>Add More</span>
              </button>
              <div aria-label="File layout" className={styles.viewToggle} role="group">
                <button aria-label="Grid view" className={view === "grid" ? styles.viewActive : ""} onClick={() => setView("grid")} type="button">
                  <span aria-hidden className={styles.gridIcon}><i /><i /><i /><i /></span>
                </button>
                <button aria-label="List view" className={view === "list" ? styles.viewActive : ""} onClick={() => setView("list")} type="button">
                  <span aria-hidden className={styles.listIcon}><i /><i /><i /></span>
                </button>
              </div>
            </div>

            <div className={view === "grid" ? styles.fileGrid : styles.fileList}>
              {files.map((file, index) => (
                <article className={styles.fileCard} key={`${file.name}-${file.size}-${index}`}>
                  <FileVisual file={file} view={view} />
                  <div className={styles.fileInfo}>
                    <strong>{file.name}</strong>
                    <span>{formatSize(file.size)}</span>
                  </div>
                  <button
                    aria-label={`Remove ${file.name}`}
                    className={styles.removeFile}
                    onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    type="button"
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.recordForm}>
            <label className={styles.recordField}>
              <span>New Record</span>
              <input onChange={(event) => setNewRecord(event.target.value)} placeholder="Medical Record" value={newRecord} />
            </label>
            <div className={styles.orDivider}><span />OR<span /></div>
            <label className={styles.recordField}>
              <span>Add to Existing</span>
              <select onChange={(event) => setExistingRecord(event.target.value)} value={existingRecord}>
                <option value="">Select a Record</option>
                {existingRecords.map((record) => (
                  <option key={record} value={record}>{record}</option>
                ))}
              </select>
            </label>
          </section>

          <div className={styles.formActions}>
            <Button onClick={closeModal} variant="bordered">Cancel</Button>
            <Button onClick={addToRecord} variant="primary">Add to Record</Button>
          </div>
        </>
      ) : (
        <div
          className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <div className={styles.dropCopy}>
            <span className={styles.uploadIcon}>
              <Image alt="" height={18} src="/icons/patients/details/upload-simple.svg" width={18} />
            </span>
            <div>
              <strong>Drag and drop your files</strong>
              <span>Upload files in PDF format (max size - 5 MB)</span>
            </div>
          </div>
          <Button className={styles.browseButton} onClick={() => inputRef.current?.click()} variant="bordered">
            Browse Files
          </Button>
          <span aria-live="polite" className={styles.error}>{error}</span>
        </div>
      )}

      <input accept="application/pdf,.pdf,image/jpeg,.jpg,.jpeg,image/png,.png" className={styles.fileInput} multiple onChange={handleInput} ref={inputRef} type="file" />
    </Modal>
  );
}
