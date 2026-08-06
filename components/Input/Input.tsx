"use client";

import Image from "next/image";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { useRef, useState } from "react";
import { SubSection } from "./Toggle";
import styles from "./Input.module.css";

export type FieldState = "disabled" | "enabled" | "hover" | "focused";
export type SearchFieldState = "enabled" | "hover" | "focused" | "filled";

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "disabled" | "size">;

export type FieldContainerProps = NativeInputProps & {
  onClear?: () => void;
  state?: FieldState;
};

export function FieldContainer({
  className = "",
  defaultValue,
  onBlur,
  onChange,
  onClear,
  onFocus,
  placeholder = "Placeholder",
  state = "enabled",
  value,
  ...props
}: FieldContainerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const [internalValue, setInternalValue] = useState(String(defaultValue ?? ""));
  const isControlled = value !== undefined;
  const currentValue = String(isControlled ? value : internalValue);
  const isFocusedSpecimen = state === "focused";
  const showClear = (isFocusedSpecimen || hasFocus) && currentValue.length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(event.target.value);
    onChange?.(event);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={`${styles.fieldContainer} ${styles[state]} ${className}`}>
      <input
        {...props}
        disabled={state === "disabled"}
        onBlur={(event) => {
          setHasFocus(false);
          onBlur?.(event);
        }}
        onChange={handleChange}
        onFocus={(event) => {
          setHasFocus(true);
          onFocus?.(event);
        }}
        placeholder={placeholder}
        ref={inputRef}
        value={currentValue}
      />
      {showClear ? (
        <button
          aria-label="Clear input"
          className={styles.clearButton}
          onClick={handleClear}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          <Image alt="" height={16} src="/icons/input/clear-field.svg" width={16} />
        </button>
      ) : null}
    </div>
  );
}

export type InputFieldProps = FieldContainerProps & {
  label?: string;
  subtext?: string;
};

export function InputField({
  className = "",
  label = "Title",
  state = "enabled",
  subtext,
  ...props
}: InputFieldProps) {
  return (
    <div className={`${styles.inputField} ${state === "disabled" ? styles.inputFieldDisabled : ""} ${className}`}>
      <span className={styles.inputLabel}>{label}</span>
      <FieldContainer {...props} className={styles.composedField} state={state} />
      {subtext ? <SubSection label={subtext} showToggle={false} /> : null}
    </div>
  );
}

export type SearchFieldProps = NativeInputProps & {
  onClear?: () => void;
  state?: SearchFieldState;
};

export function SearchField({
  className = "",
  defaultValue,
  onBlur,
  onChange,
  onClear,
  onFocus,
  placeholder = "Search",
  state = "enabled",
  value,
  ...props
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const [internalValue, setInternalValue] = useState(String(defaultValue ?? ""));
  const isControlled = value !== undefined;
  const currentValue = String(isControlled ? value : internalValue);
  const isFocusedSpecimen = state === "focused";
  const isFilled = state === "filled";
  const isActive = isFocusedSpecimen || isFilled || hasFocus || currentValue.length > 0;
  const showClear = (isFocusedSpecimen || hasFocus) && currentValue.length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(event.target.value);
    onChange?.(event);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={`${styles.searchField} ${styles[`search${state[0].toUpperCase()}${state.slice(1)}`]} ${className}`}>
      <Image
        alt=""
        className={styles.searchIcon}
        height={16}
        src={isActive ? "/icons/input/search-dark.svg" : "/icons/input/search-muted.svg"}
        width={16}
      />
      <input
        {...props}
        onBlur={(event) => {
          setHasFocus(false);
          onBlur?.(event);
        }}
        onChange={handleChange}
        onFocus={(event) => {
          setHasFocus(true);
          onFocus?.(event);
        }}
        placeholder={placeholder}
        ref={inputRef}
        value={currentValue}
      />
      {showClear ? (
        <button
          aria-label="Clear search"
          className={styles.searchTrailing}
          onClick={handleClear}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          <Image alt="" height={16} src="/icons/input/clear-search.svg" width={16} />
        </button>
      ) : (
        <span className={styles.searchTrailing} />
      )}
    </div>
  );
}
