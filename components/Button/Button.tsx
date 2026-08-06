import Image from "next/image";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "bordered" | "neutral" | "link";
export type ButtonState = "enabled" | "hover" | "pressed" | "disabled";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual emphasis for the action. */
  variant?: ButtonVariant;
  /** Error treatment for irreversible actions. */
  destructive?: boolean;
  /** Optional 14px icon before the label. */
  leadingIcon?: ReactNode | boolean;
  /** Optional 14px icon after the label. */
  trailingIcon?: ReactNode | boolean;
  /** Locks a visual state for documentation and visual testing. */
  state?: ButtonState;
};

const plusIcons = {
  disabled: "/icons/button/plus-disabled.svg",
  error: "/icons/button/plus-error.svg",
  neutral: "/icons/button/plus-neutral.svg",
  onPrimary: "/icons/button/plus-on-primary.svg",
  primary: "/icons/button/plus-primary.svg",
} as const;

export function Button({
  variant = "link",
  destructive = false,
  leadingIcon,
  trailingIcon,
  state = "enabled",
  className,
  children,
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || state === "disabled";
  const visualState = isDisabled ? "disabled" : state;
  const classNames = [
    styles.button,
    styles[variant],
    styles[visualState],
    destructive && styles.destructive,
    !children && styles.iconOnly,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconSource = isDisabled && destructive
    ? plusIcons.error
    : isDisabled
      ? plusIcons.disabled
      : destructive && variant === "bordered"
      ? plusIcons.error
      : variant === "link"
        ? plusIcons.primary
        : variant === "bordered"
          ? plusIcons.neutral
          : plusIcons.onPrimary;

  const renderIcon = (icon: ReactNode | boolean) => (
    <span className={styles.icon}>
      {icon === true ? <Image alt="" height={11} src={iconSource} width={11} /> : icon}
    </span>
  );

  return (
    <button className={classNames} disabled={isDisabled} type={type} {...props}>
      {leadingIcon ? renderIcon(leadingIcon) : null}
      {children ? <span className={styles.label}>{children}</span> : null}
      {trailingIcon ? renderIcon(trailingIcon) : null}
    </button>
  );
}
