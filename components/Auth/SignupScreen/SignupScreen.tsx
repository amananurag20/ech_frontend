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
import styles from "./SignupScreen.module.css";

export type SignupScreenProps = {
  onAppleSignup?: () => void | Promise<void>;
  onGoogleSignup?: () => void | Promise<void>;
  onPhoneSignup?: (phoneNumber: string, countryCode: string) => void | Promise<void>;
  onRegister?: (code: string, phoneNumber: string, countryCode: string) => void | Promise<void>;
};

const phoneRules = {
  "+1": { digits: 10, label: "US" },
  "+44": { digits: 10, label: "UK" },
  "+91": { digits: 10, label: "Indian" },
} as const;

type CountryCode = keyof typeof phoneRules;
type SignupStep = "options" | "phone" | "verification";

const verificationCodeLength = 5;
const minimumLoadingTime = 500;

function waitForLoadingCue() {
  return new Promise((resolve) => window.setTimeout(resolve, minimumLoadingTime));
}

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

export function SignupScreen({
  onAppleSignup,
  onGoogleSignup,
  onPhoneSignup,
  onRegister,
}: SignupScreenProps) {
  const [step, setStep] = useState<SignupStep>("options");
  const [countryCode, setCountryCode] = useState<CountryCode>("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(verificationCodeLength).fill(""),
  );
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const normalizedPhoneNumber = phoneDigits(phoneNumber);
  const isPhoneValid = normalizedPhoneNumber.length === phoneRules[countryCode].digits;
  const isVerificationComplete = verificationCode.every((digit) => digit.length === 1);

  const showOptions = () => {
    setError("");
    setVerificationCode(Array(verificationCodeLength).fill(""));
    setStep("options");
  };

  const showPreviousStep = () => {
    setError("");
    if (step === "verification") {
      setVerificationCode(Array(verificationCodeLength).fill(""));
      setStep("phone");
      return;
    }
    showOptions();
  };

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
        Promise.resolve(onPhoneSignup?.(normalizedPhone, countryCode)),
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

  const handleCodePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, verificationCodeLength);
    if (!pastedCode) return;
    event.preventDefault();
    setVerificationCode(Array.from({ length: verificationCodeLength }, (_, index) => pastedCode[index] ?? ""));
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
    setIsRegistering(true);
    try {
      await Promise.all([
        Promise.resolve(onRegister?.(code, phoneDigits(phoneNumber), countryCode)),
        waitForLoadingCue(),
      ]);
    } catch {
      setError("Unable to complete registration. Try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main className={styles.page}>
      <section aria-labelledby="signup-title" className={styles.shell}>
        <div className={styles.leftPanel}>
          <div className={`${styles.content} ${step !== "options" ? styles.flowContent : ""}`}>
            {step === "options" ? (
              <>
                <div className={styles.brand}>
                  <Image alt="" height={36} priority src="/logos/medqt-mark.svg" width={30} />
                  <Image alt="MedQT" height={22} priority src="/icons/navigation/medqt.svg" width={92} />
                </div>

                <div className={styles.signupActions}>
                  <h1 id="signup-title">Create your MedQT Account</h1>
                  <p className={styles.subtitle}>Manage your patient appointments, follow ups and much more</p>

                  <div className={styles.providers}>
                    <Button
                      className={styles.googleButton}
                      leadingIcon={<Image alt="" height={18} src="/logos/google.svg" width={18} />}
                      onClick={onGoogleSignup}
                      variant="neutral"
                    >
                      Continue with Google
                    </Button>
                    <Button
                      className={styles.actionButton}
                      leadingIcon={<Image alt="" height={18} src="/logos/apple.svg" width={17} />}
                      onClick={onAppleSignup}
                      variant="bordered"
                    >
                      Continue with Apple
                    </Button>
                  </div>

                  <div className={styles.divider}><span>OR</span></div>

                  <Button
                    className={styles.actionButton}
                    leadingIcon={<Image alt="" height={16} src="/icons/auth/phone.svg" width={16} />}
                    onClick={() => setStep("phone")}
                    variant="bordered"
                  >
                    Continue with Phone Number
                  </Button>
                </div>

                <p className={styles.signInCopy}>
                  Already have an account? <Link href="/login">Sign In</Link>
                </p>
              </>
            ) : (
              <>
                <Button
                  className={styles.backButton}
                  leadingIcon={<Image alt="" height={14} src="/icons/navigation/back.svg" width={14} />}
                  onClick={showPreviousStep}
                  variant="link"
                >
                  Go Back
                </Button>

                <div className={styles.flowFocus}>
                  {step === "phone" ? (
                    <>
                      <div className={styles.flowTitle}>
                        <h1 id="signup-title">Enter your Phone Number</h1>
                        <p>Once you register, you will receive a verification OTP</p>
                      </div>

                      <form className={styles.flowForm} onSubmit={submitPhone}>
                        <div className={styles.phoneField}>
                          <label htmlFor="signup-phone-number">Phone Number</label>
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
                              <Image alt="" aria-hidden height={6} src="/icons/navigation/caret-secondary.svg" width={10} />
                            </div>
                            <FieldContainer
                              aria-describedby={error ? "signup-phone-error" : undefined}
                              aria-invalid={Boolean(error)}
                              className={styles.phoneInput}
                              id="signup-phone-number"
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
                        </div>
                        <p aria-live="polite" className={styles.error} id="signup-phone-error">{error}</p>
                        <Button
                          className={`${styles.flowAction} ${styles.verifyAction} ${!isPhoneValid || isPhoneSubmitting ? styles.disabledFlowAction : ""}`}
                          disabled={!isPhoneValid || isPhoneSubmitting}
                          state={!isPhoneValid || isPhoneSubmitting ? "disabled" : "enabled"}
                          trailingIcon={<Image alt="" height={14} src="/icons/auth/arrow-right.svg" width={14} />}
                          type="submit"
                          variant="primary"
                        >
                          Verify
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <div className={styles.flowTitle}>
                        <h1 id="signup-title">Verify via OTP</h1>
                        <div className={styles.verificationCopy}>
                          <p>We sent a code to your number</p>
                          <p>
                            <strong>{countryCode} XXXXX XXX{phoneDigits(phoneNumber).slice(-3)}.</strong>{" "}
                            <button onClick={showPreviousStep} type="button">Change</button>
                          </p>
                        </div>
                      </div>

                      <form className={styles.flowForm} onSubmit={submitVerification}>
                        <div className={styles.otpField}>
                          <label htmlFor="signup-code-0">One Time Password (OTP)</label>
                          <div
                            className={`${styles.codeInputs} ${isVerificationComplete ? styles.codeInputsComplete : ""}`}
                            onPaste={handleCodePaste}
                          >
                            {verificationCode.map((digit, index) => (
                              <input
                                aria-label={`Verification code digit ${index + 1}`}
                                autoComplete={index === 0 ? "one-time-code" : "off"}
                                id={`signup-code-${index}`}
                                inputMode="numeric"
                                key={index}
                                maxLength={1}
                                disabled={isRegistering}
                                onChange={(event) => {
                                  const nextDigit = event.target.value.replace(/\D/g, "").slice(-1);
                                  updateCodeDigit(index, nextDigit);
                                  if (nextDigit && index < verificationCodeLength - 1) {
                                    (event.currentTarget.nextElementSibling as HTMLInputElement | null)?.focus();
                                  }
                                }}
                                onKeyDown={(event) => handleCodeKeyDown(index, event)}
                                ref={(element) => { codeInputRefs.current[index] = element; }}
                                value={digit}
                              />
                            ))}
                            {isRegistering ? (
                              <span aria-label="Completing registration" className={styles.loader} role="status">
                                <Image alt="" height={18} src="/icons/auth/loader.png" width={18} />
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <p aria-live="polite" className={styles.error}>{error}</p>
                        <Button
                          className={`${styles.flowAction} ${!isVerificationComplete || isRegistering ? styles.disabledFlowAction : ""}`}
                          disabled={!isVerificationComplete || isRegistering}
                          state={!isVerificationComplete || isRegistering ? "disabled" : "enabled"}
                          trailingIcon={<Image alt="" height={14} src="/icons/auth/arrow-right.svg" width={14} />}
                          type="submit"
                          variant="primary"
                        >
                          Register
                        </Button>
                      </form>
                    </>
                  )}
                </div>

                <button className={styles.tryAnother} onClick={showOptions} type="button">Try another way</button>
              </>
            )}
          </div>
        </div>

        <div className={styles.illustrationPanel}>
          <Image
            alt="Abstract blue MedQT illustration"
            fill
            priority
            sizes="(max-width: 900px) 0px, 50vw"
            src="/logos/Illustration Space.png"
          />
        </div>
      </section>
    </main>
  );
}
