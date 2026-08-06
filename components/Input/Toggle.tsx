"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import styles from "./Input.module.css";

export type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-checked" | "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Toggle({
  "aria-label": ariaLabel = "Toggle",
  checked,
  className = "",
  defaultChecked = false,
  onCheckedChange,
  onClick,
  ...props
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  return (
    <button
      {...props}
      aria-checked={isChecked}
      aria-label={ariaLabel}
      className={`${styles.toggle} ${isChecked ? styles.toggleOn : ""} ${className}`}
      onClick={(event) => {
        const nextChecked = !isChecked;

        if (!isControlled) setInternalChecked(nextChecked);
        onCheckedChange?.(nextChecked);
        onClick?.(event);
      }}
      role="switch"
      type="button"
    >
      <span />
    </button>
  );
}

export type SubSectionProps = {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  kind?: "text" | "informative" | "quantity";
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
  showToggle?: boolean;
  value?: ReactNode;
};

export function SubSection({
  checked,
  className = "",
  defaultChecked = false,
  kind = "text",
  label = "Subtext",
  onCheckedChange,
  showToggle = true,
  value = "Value",
}: SubSectionProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleCheckedChange = (nextChecked: boolean) => {
    if (!isControlled) setInternalChecked(nextChecked);
    onCheckedChange?.(nextChecked);
  };

  return (
    <div className={`${styles.subSection} ${isChecked ? styles.subSectionActive : ""} ${className}`}>
      {kind === "informative" ? (
        <Image alt="" height={16} src="/icons/input/info.svg" width={16} />
      ) : null}
      <span className={styles.subSectionLabel}>{label}</span>
      {kind === "quantity" ? <span className={styles.quantityValue}>{value}</span> : null}
      {kind === "text" && showToggle ? (
        <Toggle checked={isChecked} onCheckedChange={handleCheckedChange} />
      ) : null}
    </div>
  );
}
