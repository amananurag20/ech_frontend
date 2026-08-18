"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
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
  onEmailLogin?: (email: string, password: string) => void | Promise<void>;
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
type LoginMethod = "email" | "phone";
type LoginStep = "credentials" | "password" | "verification";

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

export function LoginScreen({
  onAppleLogin,
  onEmailLogin,
  onGoogleLogin,
  onPhoneLogin,
  onVerifyCode,
}: LoginScreenProps) {
  const router = useRouter();
  const [method, setMethod] = useState<LoginMethod>("email");
  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(verificationCodeLength).fill(""),
  );
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const normalizedPhoneNumber = phoneDigits(phoneNumber);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = normalizedPhoneNumber.length === phoneRules[countryCode].digits;
  const isPasswordValid = password.length > 0;
  const isVerificationComplete = verificationCode.every((digit) => digit.length === 1);

  const selectMethod = (nextMethod: LoginMethod) => {
    setMethod(nextMethod);
    setError("");
  };

  const returnToCredentials = () => {
    setVerificationCode(Array(verificationCodeLength).fill(""));
    setError("");
    setStep("credentials");
  };

  const submitCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (method === "email") {
      if (!isEmailValid) {
        setError("Enter a valid email address");
        return;
      }
      setError("");
      setIsSubmitting(true);
      await waitForLoadingCue();
      setIsSubmitting(false);
      setStep("password");
      return;
    }

    if (!isPhoneValid) {
      setError(`Enter a valid ${phoneRules[countryCode].label} phone number`);
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await Promise.all([
        Promise.resolve(onPhoneLogin?.(normalizedPhoneNumber, countryCode)),
        waitForLoadingCue(),
      ]);
      setStep("verification");
    } catch {
      setError("Unable to send the verification code. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isPasswordValid) return;

    setError("");
    setIsSubmitting(true);
    try {
      await Promise.all([
        Promise.resolve(onEmailLogin?.(email.trim(), password)),
        waitForLoadingCue(),
      ]);
      router.push("/appointments");
    } catch {
      setError("Unable to log in. Check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCodeDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setVerificationCode((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? digit : item)),
    );
    setError("");
  };

  const handleCodeKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, verificationCodeLength);
    if (!pastedCode) return;
    event.preventDefault();
    setVerificationCode(
      Array.from({ length: verificationCodeLength }, (_, index) => pastedCode[index] ?? ""),
    );
    codeInputRefs.current[Math.min(pastedCode.length, verificationCodeLength) - 1]?.focus();
    setError("");
  };

  const submitVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = verificationCode.join("");
    if (!isVerificationComplete) {
      setError("Enter the complete 5-digit code");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await Promise.all([
        Promise.resolve(onVerifyCode?.(code, normalizedPhoneNumber, countryCode)),
        waitForLoadingCue(),
      ]);
      router.push("/appointments");
    } catch {
      setError("Unable to verify the code. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCredentialsValid = method === "email" ? isEmailValid : isPhoneValid;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Image alt="MedQT" height={22} priority src="/icons/navigation/medqt.svg" width={92} />
      </header>

      <section
        aria-labelledby="login-title"
        className={`${styles.card} ${styles[step]}`}
      >
        <div className={styles.primaryContent}>
          <Image alt="" className={styles.mark} height={36} priority src="/logos/medqt-mark.svg" width={30} />

          {step === "verification" ? (
            <>
              <div className={styles.heading}>
                <h1 id="login-title">Verify via OTP</h1>
                <div className={styles.verificationCopy}>
                  <p>We sent a code to your number</p>
                  <p>
                    <strong>{countryCode} XXXXX XXX{normalizedPhoneNumber.slice(-3)}.</strong>{" "}
                    <button onClick={returnToCredentials} type="button">Change</button>
                  </p>
                </div>
              </div>

              <form className={styles.form} onSubmit={submitVerification}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="verification-code-0">One Time Password (OTP)</label>
                  <div
                    className={`${styles.codeInputs} ${isVerificationComplete ? styles.codeInputsComplete : ""}`}
                    onPaste={handleCodePaste}
                  >
                    {verificationCode.map((digit, index) => (
                      <input
                        aria-label={`Verification code digit ${index + 1}`}
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        disabled={isSubmitting}
                        id={`verification-code-${index}`}
                        inputMode="numeric"
                        key={index}
                        maxLength={1}
                        onChange={(event) => {
                          const nextDigit = event.target.value.replace(/\D/g, "").slice(-1);
                          updateCodeDigit(index, nextDigit);
                          if (nextDigit && index < verificationCodeLength - 1) {
                            codeInputRefs.current[index + 1]?.focus();
                          }
                        }}
                        onKeyDown={(event) => handleCodeKeyDown(index, event)}
                        ref={(element) => { codeInputRefs.current[index] = element; }}
                        value={digit}
                      />
                    ))}
                  </div>
                </div>
                <p aria-live="polite" className={styles.error}>{error}</p>
                <Button
                  className={styles.verifyButton}
                  disabled={!isVerificationComplete || isSubmitting}
                  state={!isVerificationComplete || isSubmitting ? "disabled" : "enabled"}
                  trailingIcon={isSubmitting ? <LoaderIcon /> : <ArrowIcon />}
                  type="submit"
                  variant="primary"
                >
                  Verify
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 id="login-title">Log into my Account</h1>

              {step === "credentials" ? (
                <form className={styles.form} onSubmit={submitCredentials}>
                  <div aria-label="Login method" className={styles.segmentedControl} role="radiogroup">
                    <button
                      aria-checked={method === "email"}
                      className={method === "email" ? styles.segmentActive : ""}
                      onClick={() => selectMethod("email")}
                      role="radio"
                      type="button"
                    >
                      Email
                    </button>
                    <button
                      aria-checked={method === "phone"}
                      className={method === "phone" ? styles.segmentActive : ""}
                      onClick={() => selectMethod("phone")}
                      role="radio"
                      type="button"
                    >
                      Phone
                    </button>
                  </div>

                  {method === "email" ? (
                    <div className={styles.fieldGroup}>
                      <label htmlFor="login-email">Enter email address</label>
                      <FieldContainer
                        aria-describedby={error ? "login-error" : undefined}
                        aria-invalid={Boolean(error)}
                        autoComplete="email"
                        className={styles.input}
                        id="login-email"
                        inputMode="email"
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setError("");
                        }}
                        onClear={() => setEmail("")}
                        placeholder=""
                        state={isSubmitting ? "disabled" : "enabled"}
                        type="email"
                        value={email}
                      />
                    </div>
                  ) : (
                    <div className={styles.fieldGroup}>
                      <label htmlFor="phone-number">Phone Number</label>
                      <div className={styles.phoneRow}>
                        <div className={styles.countrySelect}>
                          <select
                            aria-label="Country code"
                            disabled={isSubmitting}
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
                          aria-describedby={error ? "login-error" : undefined}
                          aria-invalid={Boolean(error)}
                          autoComplete="tel"
                          className={styles.phoneInput}
                          id="phone-number"
                          inputMode="tel"
                          maxLength={14}
                          onChange={(event) => {
                            setPhoneNumber(formatPhoneNumber(event.target.value, countryCode));
                            setError("");
                          }}
                          onClear={() => setPhoneNumber("")}
                          placeholder=""
                          state={isSubmitting ? "disabled" : "enabled"}
                          type="tel"
                          value={phoneNumber}
                        />
                      </div>
                    </div>
                  )}

                  <p aria-live="polite" className={styles.error} id="login-error">{error}</p>
                  <Button
                    className={styles.continueButton}
                    disabled={!isCredentialsValid || isSubmitting}
                    state={!isCredentialsValid || isSubmitting ? "disabled" : "enabled"}
                    trailingIcon={isSubmitting ? <LoaderIcon /> : undefined}
                    type="submit"
                    variant="primary"
                  >
                    {method === "email" ? "Continue with Mail" : "Continue with Phone"}
                  </Button>
                </form>
              ) : (
                <form className={styles.form} onSubmit={submitPassword}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="login-password">Password</label>
                    <FieldContainer
                      aria-describedby={error ? "password-error" : undefined}
                      aria-invalid={Boolean(error)}
                      autoComplete="current-password"
                      className={styles.input}
                      id="login-password"
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      onClear={() => setPassword("")}
                      placeholder=""
                      state={isSubmitting ? "disabled" : "enabled"}
                      type="password"
                      value={password}
                    />
                  </div>
                  <p aria-live="polite" className={styles.error} id="password-error">{error}</p>
                  <Button
                    className={styles.continueButton}
                    disabled={!isPasswordValid || isSubmitting}
                    state={!isPasswordValid || isSubmitting ? "disabled" : "enabled"}
                    trailingIcon={isSubmitting ? <LoaderIcon /> : undefined}
                    type="submit"
                    variant="primary"
                  >
                    Continue with Mail
                  </Button>
                  <button className={styles.changeEmail} onClick={returnToCredentials} type="button">
                    Change email
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {step !== "verification" ? (
          <div className={styles.secondaryContent}>
            <p className={styles.createAccount}>
              Not a member yet? <a href="/signup">Create an account</a>
            </p>
            <div className={styles.divider}><span>OR</span></div>
            <div className={styles.providers}>
              <Button
                className={styles.providerButton}
                leadingIcon={<Image alt="" height={18} src="/logos/google.svg" width={18} />}
                onClick={onGoogleLogin}
                variant="bordered"
              >
                Sign In with Google
              </Button>
              <Button
                className={styles.providerButton}
                leadingIcon={<Image alt="" height={18} src="/logos/apple.svg" width={17} />}
                onClick={onAppleLogin}
                variant="bordered"
              >
                Sign In with Apple
              </Button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function LoaderIcon() {
  return <Image alt="" className={styles.loaderIcon} height={14} src="/icons/auth/loader.png" width={14} />;
}

function ArrowIcon() {
  return <Image alt="" height={14} src="/icons/auth/arrow-right.svg" width={14} />;
}
