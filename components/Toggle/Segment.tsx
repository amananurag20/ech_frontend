"use client";

import Image from "next/image";
import {
  forwardRef,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./Toggle.module.css";

export type SegmentState = "enabled" | "hover" | "pressed" | "disabled";
export type SegmentIconPlacement = "none" | "leading" | "trailing" | "only";

export type SegmentProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-checked"> & {
  icon?: ReactNode | boolean;
  iconPlacement?: SegmentIconPlacement;
  label?: string;
  selected?: boolean;
  /** Locks a Figma state for documentation and visual testing. */
  state?: SegmentState;
};

const tennisIcons = {
  disabled: "/icons/toggle/tennis-disabled.svg",
  enabled: "/icons/toggle/tennis.svg",
  selected: "/icons/toggle/tennis-selected.svg",
} as const;

export const Segment = forwardRef<HTMLButtonElement, SegmentProps>(function Segment({
  "aria-label": ariaLabel,
  className = "",
  disabled,
  icon = true,
  iconPlacement = "none",
  label = "Label",
  selected = false,
  state = "enabled",
  type = "button",
  ...props
}, forwardedRef) {
  const isDisabled = disabled || state === "disabled";
  const hasIcon = iconPlacement !== "none";
  const iconSource = isDisabled
    ? tennisIcons.disabled
    : selected ? tennisIcons.selected : tennisIcons.enabled;
  const iconNode = icon === true
    ? <Image alt="" height={12} src={iconSource} width={12} />
    : icon;
  const classes = [
    styles.segment,
    styles[`segment${state[0].toUpperCase()}${state.slice(1)}`],
    selected && styles.segmentSelected,
    styles[`placement${iconPlacement[0].toUpperCase()}${iconPlacement.slice(1)}`],
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      {...props}
      aria-checked={selected}
      aria-label={iconPlacement === "only" ? ariaLabel ?? label : ariaLabel}
      className={classes}
      data-state={state}
      disabled={isDisabled}
      ref={forwardedRef}
      role="radio"
      type={type}
    >
      {hasIcon && ["leading", "only"].includes(iconPlacement) ? (
        <span aria-hidden className={styles.segmentIcon}>{iconNode}</span>
      ) : null}
      {iconPlacement !== "only" ? <span className={styles.segmentLabel}>{label}</span> : null}
      {hasIcon && iconPlacement === "trailing" ? (
        <span aria-hidden className={styles.segmentIcon}>{iconNode}</span>
      ) : null}
    </button>
  );
});

export type SegmentOption = {
  ariaLabel?: string;
  disabled?: boolean;
  icon?: ReactNode | boolean;
  iconPlacement?: SegmentIconPlacement;
  label: string;
  value: string;
};

export type SegmentGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SegmentOption[];
  value?: string;
};

export function SegmentGroup({
  "aria-label": ariaLabel = "View",
  className = "",
  defaultValue,
  onValueChange,
  options,
  value,
  ...props
}: SegmentGroupProps) {
  const firstEnabled = options.find((option) => !option.disabled)?.value;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const select = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!direction && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();

    const enabledIndexes = options
      .map((option, optionIndex) => option.disabled ? -1 : optionIndex)
      .filter((optionIndex) => optionIndex >= 0);
    const currentPosition = enabledIndexes.indexOf(index);
    const nextIndex = event.key === "Home" ? enabledIndexes[0]
      : event.key === "End" ? enabledIndexes.at(-1)!
      : enabledIndexes[(currentPosition + direction + enabledIndexes.length) % enabledIndexes.length];

    select(options[nextIndex].value);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div {...props} aria-label={ariaLabel} className={`${styles.segmentGroup} ${className}`} role="radiogroup">
      {options.map((option, index) => (
        <Segment
          aria-label={option.ariaLabel}
          disabled={option.disabled}
          icon={option.icon}
          iconPlacement={option.iconPlacement}
          key={option.value}
          label={option.label}
          onClick={() => select(option.value)}
          onKeyDown={(event) => move(event, index)}
          ref={(node) => { buttonRefs.current[index] = node; }}
          selected={selectedValue === option.value}
          tabIndex={selectedValue === option.value ? 0 : -1}
        />
      ))}
    </div>
  );
}
