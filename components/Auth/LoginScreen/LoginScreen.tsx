"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/Button";
import { FieldContainer } from "@/components/Input";
import styles from "./LoginScreen.module.css";

export type LoginScreenProps = {
  onAppleLogin?: () => void | Promise<void>;
  onGoogleLogin?: () => void | Promise<void>;
  onPhoneLogin?: (phoneNumber: string, countryCode: string) => void | Promise<void>;
  onVerifyCode?: (code: string, phoneNumber: string, countryCode: string) => void | Promise<void>;
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

const verificationCodeLength = 5;
const minimumLoadingTime = 500;

function waitForLoadingCue() {
  return new Promise((resolve) => window.setTimeout(resolve, minimumLoadingTime));
}

export function LoginScreen({
  onAppleLogin,
  onGoogleLogin,
  onPhoneLogin,
  onVerifyCode,
}: LoginScreenProps) {
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const [countryCode, setCountryCode] = useState<CountryCode>("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(verificationCodeLength).fill(""),
  );
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const normalizedPhoneNumber = phoneDigits(phoneNumber);
  const isPhoneValid = normalizedPhoneNumber.length === phoneRules[countryCode].digits;
  const isVerificationComplete = verificationCode.every((digit) => digit.length === 1);

  const submitPhone = async (event: FormEvent<HTMLFormElement>) => {
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
    setIsPhoneSubmitting(true);
    try {
      await Promise.all([
        Promise.resolve(onPhoneLogin?.(normalizedPhone, countryCode)),
        waitForLoadingCue(),
      ]);
      setStep("verification");
    } catch {
      setError("Unable to send the verification code. Try again.");
    } finally {
      setIsPhoneSubmitting(false);
    }
  };

  const updateCodeDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setVerificationCode((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item));
    setError("");
  };

  const handleCodeKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, verificationCodeLength);
    if (!pastedCode) return;
    event.preventDefault();
    const nextCode = Array.from({ length: verificationCodeLength }, (_, index) => pastedCode[index] ?? "");
    setVerificationCode(nextCode);
    codeInputRefs.current[Math.min(pastedCode.length, verificationCodeLength) - 1]?.focus();
    setError("");
  };

  const submitVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = verificationCode.join("");
    if (code.length !== verificationCodeLength) {
      setError("Enter the complete 5-digit code");
      return;
    }

    setError("");
    setIsVerifying(true);
    try {
      await Promise.all([
        Promise.resolve(onVerifyCode?.(code, phoneDigits(phoneNumber), countryCode)),
        waitForLoadingCue(),
      ]);
    } catch {
      setError("Unable to verify the code. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const returnToPhone = () => {
    setVerificationCode(Array(verificationCodeLength).fill(""));
    setError("");
    setStep("phone");
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Image alt="MedQT" height={22} priority src="/icons/navigation/medqt.svg" width={92} />
      </header>

      <section aria-labelledby="login-title" className={`${styles.card} ${step === "verification" ? styles.verificationCard : ""}`}>
        <Image alt="" className={styles.mark} height={36} priority src="/logos/medqt-mark.svg" width={30} />
        {step === "phone" ? <>
          <h1 id="login-title">Log into my Account</h1>

          <form className={styles.form} onSubmit={submitPhone}>
          <label htmlFor="phone-number">Phone Number</label>
          <div className={styles.phoneRow}>
            <div className={styles.countrySelect}>
              <select
                aria-label="Country code"
                disabled={isPhoneSubmitting}
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
              state={isPhoneSubmitting ? "disabled" : "enabled"}
              type="tel"
              value={phoneNumber}
            />
            {isPhoneSubmitting ? (
              <span aria-label="Sending verification code" className={`${styles.loader} ${styles.phoneLoader}`} role="status">
                <Image alt="" height={18} src="/icons/auth/loader.png" width={18} />
              </span>
            ) : null}
          </div>
          <p aria-live="polite" className={styles.error} id="phone-error">{error}</p>
          <Button
            className={`${styles.continueButton} ${!isPhoneValid || isPhoneSubmitting ? styles.disabledAction : ""}`}
            disabled={!isPhoneValid || isPhoneSubmitting}
            state={!isPhoneValid || isPhoneSubmitting ? "disabled" : "enabled"}
            type="submit"
            variant="primary"
          >
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
        </> : <>
          <h1 id="login-title">Verify via OTP</h1>
          <div className={styles.verificationCopy}>
            <p>We sent a code to your number</p>
            <p>
              <strong>{countryCode} XXXXX XXX{phoneDigits(phoneNumber).slice(-3)}.</strong>{" "}
              <button onClick={returnToPhone} type="button">Change</button>
            </p>
          </div>

          <form className={styles.verificationForm} onSubmit={submitVerification}>
            <label htmlFor="verification-code-0">One Time Password (OTP)</label>
            <div
              className={`${styles.codeInputs} ${isVerificationComplete ? styles.codeInputsComplete : ""}`}
              onPaste={handleCodePaste}
            >
              {verificationCode.map((digit, index) => (
                <input
                  aria-label={`Verification code digit ${index + 1}`}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  id={`verification-code-${index}`}
                  inputMode="numeric"
                  key={index}
                  maxLength={1}
                  disabled={isVerifying}
                  onChange={(event) => {
                    const digit = event.target.value.replace(/\D/g, "").slice(-1);
                    updateCodeDigit(index, digit);
                    if (digit && index < verificationCodeLength - 1) {
                      (event.currentTarget.nextElementSibling as HTMLInputElement | null)?.focus();
                    }
                  }}
                  onKeyDown={(event) => handleCodeKeyDown(index, event)}
                  ref={(element) => { codeInputRefs.current[index] = element; }}
                  value={digit}
                />
              ))}
              {isVerifying ? (
                <span aria-label="Verifying code" className={styles.loader} role="status">
                  <Image alt="" height={18} src="/icons/auth/loader.png" width={18} />
                </span>
              ) : null}
            </div>
            <p aria-live="polite" className={styles.verificationError}>{error}</p>
            <Button
              className={`${styles.verifyButton} ${!isVerificationComplete || isVerifying ? styles.disabledAction : ""}`}
              disabled={!isVerificationComplete || isVerifying}
              state={!isVerificationComplete || isVerifying ? "disabled" : "enabled"}
              trailingIcon={<Image alt="" height={14} src="/icons/auth/arrow-right.svg" width={14} />}
              type="submit"
              variant="primary"
            >
              Verify
            </Button>
          </form>
        </>}
      </section>
    </main>
  );
}
