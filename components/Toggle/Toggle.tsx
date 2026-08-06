"use client";

import type { ButtonHTMLAttributes } from "react";
import { useState } from "react";
import styles from "./Toggle.module.css";

export type ToggleState = "enabled" | "pressed" | "disabled";

export type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-checked" | "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Locks a Figma state for documentation and visual testing. */
  state?: ToggleState;
};

export function Toggle({
  "aria-label": ariaLabel = "Toggle",
  checked,
  className = "",
  defaultChecked = false,
  disabled,
  onCheckedChange,
  onClick,
  state = "enabled",
  ...props
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  const isDisabled = disabled || state === "disabled";

  return (
    <button
      {...props}
      aria-checked={isChecked}
      aria-label={ariaLabel}
      className={`${styles.toggle} ${styles[state]} ${isChecked ? styles.on : styles.off} ${className}`}
      data-state={state}
      disabled={isDisabled}
      onClick={(event) => {
        const nextChecked = !isChecked;
        if (!isControlled) setInternalChecked(nextChecked);
        onCheckedChange?.(nextChecked);
        onClick?.(event);
      }}
      role="switch"
      type="button"
    >
      <span className={styles.knob} />
    </button>
  );
}
