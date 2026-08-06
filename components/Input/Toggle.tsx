"use client";

import { Toggle, type ToggleProps } from "@/components/Toggle";
import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import styles from "./Input.module.css";

export { Toggle };
export type { ToggleProps };

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
