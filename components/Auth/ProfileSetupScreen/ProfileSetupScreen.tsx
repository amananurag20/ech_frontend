"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { FieldContainer } from "@/components/Input";
import styles from "./ProfileSetupScreen.module.css";

const roles = ["Clinic Admin", "Doctor", "Clerk / View only"] as const;

export type ProfileSetupData = {
  name: string;
  role: string;
  profilePicture?: File;
};

export type ProfileSetupScreenProps = {
  onContinue?: (profile: ProfileSetupData) => void | Promise<void>;
};

export function ProfileSetupScreen({ onContinue }: ProfileSetupScreenProps) {
  const router = useRouter();
  const uploadRef = useRef<HTMLInputElement>(null);
  const roleFieldRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("Jackson Fowler");
  const [role, setRole] = useState<(typeof roles)[number]>("Clinic Admin");
  const [roleOpen, setRoleOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File>();
  const [profilePreview, setProfilePreview] = useState("/logos/profile-avatar.png");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canContinue = Boolean(name.trim() && role && !isSubmitting);

  useEffect(() => {
    if (!roleOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!roleFieldRef.current?.contains(event.target as Node)) setRoleOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRoleOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [roleOpen]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5MB");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setProfilePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setProfilePicture(file);
    setError("");
  };

  const submitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Enter your name");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onContinue?.({ name: name.trim(), role, profilePicture });
    } catch {
      setError("Unable to save your profile. Try again.");
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
          <li aria-current="step" className={styles.currentStep}><i /><span>Set Up Account</span></li>
          <li aria-hidden className={styles.stepLine} />
          <li className={styles.futureStep}><i /><span>Working Hours</span></li>
        </ol>
      </header>

      <section aria-labelledby="profile-setup-title" className={styles.shell}>
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
              <h1 id="profile-setup-title">Let’s set up</h1>
              <p>Add your details, this will be shared with patients while booking</p>
            </div>

            <form className={styles.form} onSubmit={submitProfile}>
              <div className={styles.profileField}>
                <span>Profile picture</span>
                <div className={styles.uploadRow}>
                  <span className={styles.avatar}>
                    <Image alt="Profile preview" fill sizes="64px" src={profilePreview} unoptimized={profilePreview.startsWith("data:")} />
                  </span>
                  <Button onClick={() => uploadRef.current?.click()} variant="bordered">Upload</Button>
                  <input accept="image/*" className={styles.fileInput} onChange={handleUpload} ref={uploadRef} type="file" />
                </div>
                <small>Recommended size 64x64px (max 5mb)</small>
              </div>

              <label className={styles.textField}>
                <span>Your Name</span>
                <FieldContainer
                  onChange={(event) => { setName(event.target.value); setError(""); }}
                  placeholder="Your name"
                  value={name}
                />
              </label>

              <div className={styles.roleField} ref={roleFieldRef}>
                <span>Role</span>
                <button
                  aria-expanded={roleOpen}
                  aria-haspopup="listbox"
                  className={styles.roleTrigger}
                  onClick={() => setRoleOpen((open) => !open)}
                  type="button"
                >
                  <span>{role}</span>
                  <span
                    aria-hidden
                    className={`${styles.roleCaret} ${roleOpen ? styles.roleCaretOpen : ""}`}
                  >
                    <Image alt="" height={6} src="/icons/navigation/caret-secondary.svg" width={10} />
                  </span>
                </button>
                {roleOpen ? (
                  <div aria-label="Role" className={styles.roleMenu} role="listbox">
                    {roles.map((option) => (
                      <button
                        aria-selected={role === option}
                        className={role === option ? styles.selectedRole : ""}
                        key={option}
                        onClick={() => { setRole(option); setRoleOpen(false); }}
                        role="option"
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <p aria-live="polite" className={styles.error}>{error}</p>
              <Button
                className={styles.continueButton}
                disabled={!canContinue}
                state={canContinue ? "enabled" : "disabled"}
                trailingIcon={<Image alt="" height={14} src="/icons/auth/arrow-right.svg" width={14} />}
                type="submit"
                variant="primary"
              >
                Continue
              </Button>
            </form>
          </div>
        </div>

        <ProfilePreview name={name} profilePreview={profilePreview} role={role} />
      </section>
    </main>
  );
}

function ProfilePreview({ name, profilePreview, role }: { name: string; profilePreview: string; role: string }) {
  return (
    <aside aria-label="Public profile preview" className={styles.previewPanel}>
      <div className={styles.browserFrame}>
        <div className={styles.browserBar}>
          <div aria-hidden className={styles.browserActions}>
            <div className={styles.browserNavigation}>
              <span className={styles.browserControl}>
                <Image alt="" height={9} src="/icons/auth/profile-browser-back.svg" width={11} />
              </span>
              <span className={styles.browserControl}>
                <Image alt="" height={9} src="/icons/auth/profile-browser-forward.svg" width={11} />
              </span>
            </div>
            <span className={styles.browserControl}>
              <Image alt="" height={11} src="/icons/auth/profile-reload.svg" width={12} />
            </span>
          </div>
          <div className={styles.address}>mqt.com/ur-jck-fowler-716eu7</div>
        </div>

        <div className={styles.publicPage}>
          <div className={styles.publicProfile}>
            <span className={styles.avatar}>
              <Image alt="" fill sizes="64px" src={profilePreview} unoptimized={profilePreview.startsWith("data:")} />
            </span>
            <div>
              <h2>{name.trim() || "Your Name"}</h2>
              <p>{role || "your role shows here"}</p>
            </div>
          </div>

          <div aria-hidden className={styles.skeleton}>
            {[0, 1, 2, 3].map((item) => (
              <div className={styles.skeletonRow} key={item}>
                <i /><span><b /><b /></span>
              </div>
            ))}
            <div className={styles.skeletonWide} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
          </div>
        </div>
      </div>
    </aside>
  );
}
