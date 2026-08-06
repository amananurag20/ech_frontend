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

const phoneRules = {
  "+1": { digits: 10, label: "US" },
  "+44": { digits: 10, label: "UK" },
  "+91": { digits: 10, label: "Indian" },
} as const;

type CountryCode = keyof typeof phoneRules;

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhoneNumber(value: string, countryCode: CountryCode) {
  const digits = phoneDigits(value).slice(0, phoneRules[countryCode].digits);

  if (countryCode === "+1") {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (countryCode === "+44") {
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }

  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function LoginScreen({ onAppleLogin, onGoogleLogin, onPhoneLogin }: LoginScreenProps) {
  const [countryCode, setCountryCode] = useState<CountryCode>("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const submitPhone = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = phoneDigits(phoneNumber);
    const rule = phoneRules[countryCode];

    if (!normalizedPhone) {
      setError("Enter your phone number");
      return;
    }

    if (normalizedPhone.length !== rule.digits) {
      setError(`Enter a valid ${rule.label} phone number`);
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
        <Image alt="" className={styles.mark} height={36} priority src="/logos/medqt-mark.svg" width={30} />
        <h1 id="login-title">Log into my Account</h1>

        <form className={styles.form} onSubmit={submitPhone}>
          <label htmlFor="phone-number">Phone Number</label>
          <div className={styles.phoneRow}>
            <div className={styles.countrySelect}>
              <select
                aria-label="Country code"
                onChange={(event) => {
                  const nextCountry = event.target.value as CountryCode;
                  setCountryCode(nextCountry);
                  setPhoneNumber((current) => formatPhoneNumber(current, nextCountry));
                  setError("");
                }}
                value={countryCode}
              >
                <option value="+1">US (+1)</option>
                <option value="+44">UK (+44)</option>
                <option value="+91">IN (+91)</option>
              </select>
              <Image
                alt=""
                aria-hidden
                className={styles.countryCaret}
                height={6}
                src="/icons/navigation/caret-secondary.svg"
                width={10}
              />
            </div>
            <FieldContainer
              aria-describedby={error ? "phone-error" : undefined}
              aria-invalid={Boolean(error)}
              className={styles.phoneInput}
              id="phone-number"
              inputMode="tel"
              maxLength={14}
              onChange={(event) => {
                setPhoneNumber(formatPhoneNumber(event.target.value, countryCode));
                setError("");
              }}
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
