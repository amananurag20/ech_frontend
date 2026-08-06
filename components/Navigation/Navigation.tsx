"use client";

import Image from "next/image";
import {
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./Navigation.module.css";

export type IconCandyTone =
  | "bronze"
  | "clear"
  | "glass"
  | "glaze-blue"
  | "glow-violet"
  | "night-haze"
  | "sea-green"
  | "warm-brick";

export type IconCandyProps = {
  className?: string;
  icon?: ReactNode;
  tone?: IconCandyTone;
};

export function IconCandy({ className = "", icon, tone = "glaze-blue" }: IconCandyProps) {
  const darkGlyph = tone === "glass" || tone === "clear";

  return (
    <span className={`${styles.iconCandy} ${styles[tone]} ${className}`}>
      {icon ?? (
        <Image
          alt=""
          height={11}
          src={darkGlyph ? "/icons/navigation/squares-dark.svg" : "/icons/navigation/squares-light.svg"}
          width={11}
        />
      )}
    </span>
  );
}

export type NavTabState = "enabled" | "hover" | "selected";

export type NavTabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon?: ReactNode;
  label?: string;
  leadingCaret?: boolean;
  state?: NavTabState;
  subLabel?: string;
  tone?: IconCandyTone;
};

export function NavTab({
  className = "",
  icon,
  label = "Dashboard",
  leadingCaret = false,
  state = "enabled",
  subLabel,
  tone = "night-haze",
  type = "button",
  ...props
}: NavTabProps) {
  return (
    <button
      aria-current={state === "selected" ? "page" : undefined}
      className={`${styles.navTab} ${styles[`navTab${state[0].toUpperCase()}${state.slice(1)}`]} ${className}`}
      type={type}
      {...props}
    >
      {leadingCaret ? (
        <Image alt="" height={6} src="/icons/navigation/caret.svg" width={11} />
      ) : null}
      <IconCandy icon={icon} tone={tone} />
      <span className={styles.navLabel}>{label}</span>
      {subLabel ? <span className={styles.navSubLabel}>{subLabel}</span> : null}
    </button>
  );
}

export type NavigationItem = {
  icon?: string;
  id: string;
  label: string;
  subLabel?: string;
  tone?: IconCandyTone;
};

type SelectableNavigationProps = {
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
};

export type PrimaryNavigationProps = SelectableNavigationProps & {
  className?: string;
  items?: NavigationItem[];
  onNext?: () => void;
  onPrevious?: () => void;
  onSearch?: () => void;
};

export const defaultPrimaryItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", tone: "night-haze" },
  { id: "patients", label: "Patients", tone: "sea-green", icon: "/icons/navigation/patients.svg" },
  { id: "reminders", label: "Reminders", tone: "sea-green", icon: "/icons/navigation/reminders.svg" },
  { id: "availability", label: "Availability", tone: "glaze-blue", icon: "/icons/navigation/availability.svg" },
  { id: "appointments", label: "Appointments", tone: "glaze-blue", icon: "/icons/navigation/appointments.svg" },
  { id: "settings", label: "Settings", tone: "glaze-blue", icon: "/icons/navigation/settings.svg" },
];

function useSelection({ activeId, defaultActiveId, onActiveChange }: SelectableNavigationProps) {
  const [internalId, setInternalId] = useState(defaultActiveId);
  const isControlled = activeId !== undefined;
  const selectedId = isControlled ? activeId : internalId;
  const select = (id: string) => {
    if (!isControlled) setInternalId(id);
    onActiveChange?.(id);
  };
  return { selectedId, select };
}

function itemIcon(item: NavigationItem) {
  return item.icon ? <Image alt="" height={13} src={item.icon} width={13} /> : undefined;
}

export function PrimaryNavigation({
  activeId,
  className = "",
  defaultActiveId,
  items = defaultPrimaryItems,
  onActiveChange,
  onNext,
  onPrevious,
  onSearch,
}: PrimaryNavigationProps) {
  const { selectedId, select } = useSelection({ activeId, defaultActiveId, onActiveChange });

  return (
    <nav aria-label="Primary" className={`${styles.navigationPanel} ${className}`}>
      <div className={styles.primaryHeader}>
        <Image alt="MedQT" height={20} src="/icons/navigation/medqt.svg" width={83} />
        <button aria-label="Search" className={styles.roundControl} onClick={onSearch} type="button">
          <Image alt="" height={13} src="/icons/navigation/search.svg" width={13} />
        </button>
        <span className={styles.pairedControls}>
          <button aria-label="Previous" onClick={onPrevious} type="button">
            <Image alt="" height={11} src="/icons/navigation/chevron-left.svg" width={7} />
          </button>
          <button aria-label="Next" onClick={onNext} type="button">
            <Image alt="" height={11} src="/icons/navigation/chevron-right.svg" width={7} />
          </button>
        </span>
      </div>

      <div className={styles.primaryLinks}>
        <div className={styles.inboxRow}>
          <Image alt="" height={14} src="/icons/navigation/inbox.svg" width={14} />
          <span>Inbox</span><span>+99</span>
        </div>
        <div className={styles.primaryTopGroup}>
          {items.slice(0, 3).map((item) => (
            <NavTab
              icon={itemIcon(item)}
              key={item.id}
              label={item.label}
              onClick={() => select(item.id)}
              state={selectedId === item.id ? "selected" : "enabled"}
              subLabel={item.subLabel}
              tone={item.tone}
            />
          ))}
        </div>
        <div className={styles.primaryBottomGroup}>
          {items.slice(3).map((item) => (
            <NavTab
              icon={itemIcon(item)}
              key={item.id}
              label={item.label}
              onClick={() => select(item.id)}
              state={selectedId === item.id ? "selected" : "enabled"}
              subLabel={item.subLabel}
              tone={item.tone}
            />
          ))}
        </div>
      </div>

      <div className={styles.version}>
        <span>Powered by MedQT</span>
        <span>Version 1.0.0</span>
      </div>
    </nav>
  );
}

export type SecondaryNavigationProps = SelectableNavigationProps & {
  className?: string;
  onBack?: () => void;
};

const secondaryGroups = [
  {
    label: "General",
    items: [
      { id: "basic", label: "Basic", icon: "/icons/navigation/secondary-unknown-1.svg" },
      { id: "host", label: "Host", icon: "/icons/navigation/secondary-unknown-2.svg" },
    ],
  },
  {
    label: "Appointments",
    items: [
      { id: "secondary-availability", label: "Availability", icon: "/icons/navigation/secondary-availability.svg" },
      { id: "invitee-form", label: "Invitee Form", icon: "/icons/navigation/secondary-form.svg" },
      { id: "confirmation", label: "Confirmation", icon: "/icons/navigation/secondary-confirmation.svg" },
      { id: "secondary-settings", label: "Settings", icon: "/icons/navigation/secondary-settings.svg" },
    ],
  },
];

export function SecondaryNavigation({
  activeId,
  className = "",
  defaultActiveId = "basic",
  onActiveChange,
  onBack,
}: SecondaryNavigationProps) {
  const { selectedId, select } = useSelection({ activeId, defaultActiveId, onActiveChange });

  return (
    <nav aria-label="Secondary" className={`${styles.navigationPanel} ${className}`}>
      <div className={styles.secondaryHeader}>
        <button onClick={onBack} type="button">
          <Image alt="" height={10} src="/icons/navigation/back.svg" width={12} />
          <span>Go Back</span>
        </button>
      </div>
      <div className={styles.secondaryLinks}>
        {secondaryGroups.map((group, groupIndex) => (
          <section className={styles.secondaryGroup} key={group.label}>
            <h4>{group.label}<Image alt="" height={5} src="/icons/navigation/caret-secondary.svg" width={9} /></h4>
            {group.items.map((item) => (
              <NavTab
                icon={<Image alt="" height={13} src={item.icon} width={13} />}
                key={item.id}
                label={item.label}
                onClick={() => select(item.id)}
                state={selectedId === item.id ? "selected" : "enabled"}
                tone="glass"
              />
            ))}
            {groupIndex === 0 ? <hr /> : null}
          </section>
        ))}
      </div>
    </nav>
  );
}

export type NavigationProps = {
  className?: string;
};

export function Navigation({ className = "" }: NavigationProps) {
  return (
    <div className={`${styles.navigation} ${className}`}>
      <PrimaryNavigation />
      <SecondaryNavigation />
    </div>
  );
}
