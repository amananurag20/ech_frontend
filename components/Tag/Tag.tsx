import Image from "next/image";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Tag.module.css";

export type TagType = "neutral" | "color";
export type TagState = "disabled" | "enabled" | "hover" | "pressed" | "selected";

export type TagProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Main tag text. */
  label?: string;
  /** Optional 12px value displayed after the label. */
  subLabel?: ReactNode;
  /** Adds the Figma globe icon, or renders a supplied icon. */
  leadingIcon?: ReactNode | boolean;
  /** Adds the Figma close icon, or renders a supplied icon. */
  trailingIcon?: ReactNode | boolean;
  /** Neutral or blue color treatment from the Figma component. */
  type?: TagType;
  /** Locks a visual state for documentation and visual testing. */
  state?: TagState;
  /** Called by the trailing remove control when it is activated. */
  onRemove?: () => void;
  removeLabel?: string;
};

const globeIcons = {
  neutral: "/icons/tag/globe-neutral.svg",
  disabled: "/icons/tag/globe-disabled.svg",
  selected: "/icons/tag/globe-selected.svg",
  color: "/icons/tag/globe-color.svg",
  colorDisabled: "/icons/tag/globe-color-disabled.svg",
} as const;

export function Tag({
  className = "",
  label = "Label",
  leadingIcon = false,
  onRemove,
  removeLabel,
  state = "enabled",
  subLabel,
  trailingIcon = false,
  type = "neutral",
  ...props
}: TagProps) {
  const isDisabled = state === "disabled";
  const hasLeading = Boolean(leadingIcon);
  const hasTrailing = Boolean(trailingIcon);
  const classes = [
    styles.tag,
    styles[type],
    styles[state],
    hasLeading && styles.hasLeading,
    hasTrailing && styles.hasTrailing,
    hasLeading && hasTrailing && styles.hasBoth,
    subLabel !== undefined && styles.hasSubLabel,
    className,
  ].filter(Boolean).join(" ");

  const globeSource = type === "color"
    ? isDisabled ? globeIcons.colorDisabled : globeIcons.color
    : isDisabled ? globeIcons.disabled : state === "selected" ? globeIcons.selected : globeIcons.neutral;

  const defaultLeading = (
    <Image alt="" height={13} src={globeSource} width={13} />
  );
  const closeSource = hasLeading
    ? "/icons/tag/close-compact.svg"
    : "/icons/tag/close-neutral.svg";
  const closeSize = hasLeading ? 9 : 10;
  const defaultTrailing = (
    <Image alt="" height={closeSize} src={closeSource} width={closeSize} />
  );

  const trailingContent = trailingIcon === true ? defaultTrailing : trailingIcon;

  return (
    <span
      aria-disabled={isDisabled || undefined}
      className={classes}
      data-state={state}
      data-type={type}
      {...props}
    >
      {hasLeading ? (
        <span aria-hidden className={styles.leading}>
          {leadingIcon === true ? defaultLeading : leadingIcon}
        </span>
      ) : null}
      <span className={styles.label}>{label}</span>
      {subLabel !== undefined ? <span className={styles.subLabel}>{subLabel}</span> : null}
      {hasTrailing ? onRemove ? (
        <button
          aria-label={removeLabel ?? `Remove ${label}`}
          className={styles.removeButton}
          disabled={isDisabled}
          onClick={onRemove}
          type="button"
        >
          {trailingContent}
        </button>
      ) : (
        <span aria-hidden className={styles.trailing}>{trailingContent}</span>
      ) : null}
    </span>
  );
}
