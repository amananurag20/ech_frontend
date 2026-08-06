"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { FieldContainer } from "@/components/Input";
import styles from "./LoginScreen.module.css";

export type LoginScreenProps = {
  onAppleLogin?: () => void;
  onGoogleLogin?: () => void;
  onPhoneLogin?: (phoneNumber: string, countryCode: string) => void;
};

export function LoginScreen({ onAppleLogin, onGoogleLogin, onPhoneLogin }: LoginScreenProps) {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const submitPhone = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = phoneNumber.trim();

    if (!normalizedPhone) {
      setError("Enter your phone number");
      return;
    }

    setError("");
    onPhoneLogin?.(normalizedPhone, countryCode);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Image alt="MedQT" height={22} priority src="/icons/navigation/medqt.svg" width={92} />
      </header>

      <section aria-labelledby="login-title" className={styles.card}>
        <Image alt="" className={styles.mark} height={38} priority src="/logos/medqt-mark.svg" width={32} />
        <h1 id="login-title">Log into my Account</h1>

        <form className={styles.form} onSubmit={submitPhone}>
          <label htmlFor="phone-number">Phone Number</label>
          <div className={styles.phoneRow}>
            <div className={styles.countrySelect}>
              <select
                aria-label="Country code"
                onChange={(event) => setCountryCode(event.target.value)}
                value={countryCode}
              >
                <option value="+1">US (+1)</option>
                <option value="+44">UK (+44)</option>
                <option value="+91">IN (+91)</option>
              </select>
              <span aria-hidden>⌄</span>
            </div>
            <FieldContainer
              aria-describedby={error ? "phone-error" : undefined}
              aria-invalid={Boolean(error)}
              className={styles.phoneInput}
              id="phone-number"
              inputMode="tel"
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder=""
              type="tel"
              value={phoneNumber}
            />
          </div>
          <p aria-live="polite" className={styles.error} id="phone-error">{error}</p>
          <Button className={styles.continueButton} type="submit" variant="primary">
            Continue with Phone
          </Button>
        </form>

        <p className={styles.createAccount}>
          Not a member yet? <Link href="/signup">Create an account</Link>
        </p>

        <div className={styles.divider}><span>OR</span></div>

        <div className={styles.providers}>
          <Button className={styles.providerButton} leadingIcon={<Image alt="" height={18} src="/logos/google.svg" width={18} />} onClick={onGoogleLogin} variant="bordered">
            Sign In with Google
          </Button>
          <Button className={styles.providerButton} leadingIcon={<Image alt="" height={18} src="/logos/apple.svg" width={17} />} onClick={onAppleLogin} variant="bordered">
            Sign In with Apple
          </Button>
        </div>
      </section>
    </main>
  );
}
