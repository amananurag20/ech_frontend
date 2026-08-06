import { Button, type ButtonState, type ButtonVariant } from "@/components/Button";
import { FieldContainer, InputField, SearchField, SubSection } from "@/components/Input";
import { Tag, type TagState, type TagType } from "@/components/Tag";
import {
  IconCandy,
  Navigation,
  NavTab,
  type IconCandyTone,
} from "@/components/Navigation";
import {
  Segment,
  Toggle,
  type SegmentIconPlacement,
  type SegmentState,
  type ToggleState,
} from "@/components/Toggle";
import { Tooltip, TooltipTrigger, type TooltipOrigin } from "@/components/Tooltip";
import type { ReactNode } from "react";
import styles from "./page.module.css";

const states: ButtonState[] = ["disabled", "enabled", "hover", "pressed"];
const iconPositions = ["none", "leading", "trailing"] as const;

type ButtonGroupProps = {
  destructive?: boolean;
  variant: ButtonVariant;
};

function ButtonGroup({ destructive = false, variant }: ButtonGroupProps) {
  return (
    <div className={styles.buttonGroup}>
      {states.flatMap((state) =>
        iconPositions.map((position) => (
          <Button
            destructive={destructive}
            key={`${state}-${position}`}
            leadingIcon={position === "leading"}
            state={state}
            trailingIcon={position === "trailing"}
            variant={variant}
          >
            Label
          </Button>
        )),
      )}
    </div>
  );
}

function DestructiveButtonGroup() {
  const destructiveStates = [
    { state: "enabled" as const, variant: "bordered" as const },
    { state: "enabled" as const, variant: "primary" as const },
    { state: "hover" as const, variant: "primary" as const },
    { state: "pressed" as const, variant: "primary" as const },
  ];

  return (
    <div className={styles.buttonGroup}>
      {destructiveStates.flatMap(({ state, variant }) =>
        iconPositions.map((position) => (
          <Button
            destructive
            key={`${variant}-${state}-${position}`}
            leadingIcon={position === "leading"}
            state={state}
            trailingIcon={position === "trailing"}
            variant={variant}
          >
            Label
          </Button>
        )),
      )}
    </div>
  );
}

function IconButtonGroup() {
  const variants = [
    { variant: "link" as const },
    { variant: "primary" as const },
    { variant: "neutral" as const },
    { variant: "bordered" as const },
    { destructive: true, variant: "primary" as const },
  ];

  return (
    <div className={styles.iconGroup}>
      {states.flatMap((state) =>
        variants.map(({ destructive, variant }) => {
          const isDestructiveOutline = destructive && state === "disabled";
          const renderedState = isDestructiveOutline ? "enabled" : state;
          const renderedVariant = isDestructiveOutline ? "bordered" : variant;

          return (
            <Button
              aria-label={`${renderedVariant} ${renderedState}`}
              destructive={destructive}
              key={`${renderedVariant}-${destructive ? "destructive" : "regular"}-${renderedState}`}
              leadingIcon
              state={renderedState}
              variant={renderedVariant}
            />
          );
        }),
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.workspace}>
      <section className={styles.sheet}>
        <p className={styles.eyebrow}>Descriptions</p>
        <div aria-hidden className={styles.swatch}>
          <span />
        </div>

        <h1 className={styles.title}>Buttons</h1>
        <p className={styles.description}>
          One clear action per button. Label = 1–3 words max, lead with an action verb
          (&quot;Save&quot;, &quot;Add New&quot;, &quot;Delete&quot;). Never stretch to fill width. Never
          override the fixed height — icon presence/label length changes width only, not height.
        </p>

        <p className={styles.componentName}>
          <span aria-hidden>❖</span> Button
        </p>

        <div className={styles.componentFrame}>
          <div className={styles.specimenRow}>
            <ButtonGroup variant="link" />
            <ButtonGroup variant="primary" />
            <ButtonGroup variant="neutral" />
          </div>
          <div className={styles.specimenRow}>
            <ButtonGroup variant="bordered" />
            <DestructiveButtonGroup />
            <IconButtonGroup />
          </div>
        </div>
      </section>

      <section className={styles.inputSheet}>
        <p className={styles.inputEyebrow}>Descriptions</p>
        <div aria-hidden className={styles.inputSwatch}><span /></div>

        <h2 className={styles.inputTitle}>Input Fields</h2>
        <p className={styles.inputDescription}>
          One clear action per button. Label = 1–3 words max, lead with an action verb
          (&quot;Save&quot;, &quot;Add New&quot;, &quot;Delete&quot;). Never stretch to fill width. Never override the fixed
          height — icon presence/label length changes width only, not height.
        </p>

        <div className={styles.inputGrid}>
          <div>
            <Specimen title="Field Containers" frameClass={styles.fieldFrame}>
              <FieldContainer state="disabled" />
              <FieldContainer state="enabled" />
              <FieldContainer state="hover" />
              <FieldContainer defaultValue="Placeholder" state="focused" />
            </Specimen>

            <Specimen title="Sub section" frameClass={styles.subFrame}>
              <SubSection />
              <SubSection defaultChecked />
              <SubSection kind="informative" showToggle={false} />
              <SubSection kind="quantity" showToggle={false} />
            </Specimen>

            <Specimen title="Search Field" frameClass={styles.searchFrame}>
              <SearchField state="enabled" />
              <SearchField state="hover" />
              <SearchField defaultValue="Search" state="focused" />
              <SearchField defaultValue="Search" state="filled" />
            </Specimen>
          </div>

          <Specimen title="Input Fields" frameClass={styles.inputsFrame}>
            <InputField state="disabled" />
            <InputField state="enabled" />
            <InputField state="enabled" subtext="Subtext" />
          </Specimen>
        </div>
      </section>

      <section className={styles.tooltipSheet}>
        <p className={styles.tooltipEyebrow}>Descriptions</p>
        <TooltipTrigger originPosition="top-left" text="Tooltip example">
          <button aria-label="Tooltip example" className={styles.tooltipSwatch} type="button"><span /></button>
        </TooltipTrigger>

        <h2 className={styles.tooltipTitle}>Tooltips</h2>
        <p className={styles.tooltipDescription}>
          A small contextual label that appears on hover/focus to clarify an element&apos;s purpose —
          mainly icon-only buttons, truncated text, or disabled states that need a reason.
        </p>

        <section className={styles.tooltipSpecimen}>
          <h3 className={styles.tooltipComponentName}><span aria-hidden>❖</span>Tooltip</h3>
          <div className={styles.tooltipFrame}>
            {tooltipOrigins.map((origin) => (
              <Tooltip key={origin} originPosition={origin} />
            ))}
          </div>
        </section>
      </section>

      <section className={styles.tagsSheet}>
        <p className={styles.tagsEyebrow}>Descriptions</p>
        <div aria-hidden className={styles.tagsSwatch}><span /><span /></div>

        <h2 className={styles.tagsTitle}>Tags</h2>
        <p className={styles.tagsDescription}>
          Tags label, filter, and hold search parameters — never actions (Button) or single-choice
          selections (Toggle). The same pill adapts across all three roles through its icon and state
          configuration.
        </p>

        <section className={styles.tagsSpecimen}>
          <h3 className={styles.tagsComponentName}><span aria-hidden>❖</span>Tags</h3>
          <div className={styles.tagsFrame}>
            <TagMatrix type="neutral" />
            <TagMatrix type="color" />
          </div>
        </section>
      </section>

      <section className={styles.togglesSheet}>
        <div className={styles.togglesDescription}>
          <div aria-hidden className={styles.togglesLogo}><span /><span /></div>
          <div className={styles.togglesCopy}>
            <h2>Toggles</h2>
            <p>
              Not a standalone button — always lives inside a segmented control / toggle group
              container. Represents one option among a set; its job is to show which option is
              currently selected.
            </p>
            <p>
              A binary on/off control for a single independent setting (e.g. notifications, dark
              mode, a feature flag).
            </p>
          </div>
        </div>

        <div className={styles.togglesSpecimens}>
          <ToggleSpecimen title="Segment Container" className={styles.segmentSpecimen}>
            <SegmentMatrix />
          </ToggleSpecimen>
          <ToggleSpecimen title="Toggle" className={styles.toggleSpecimen}>
            <ToggleMatrix />
          </ToggleSpecimen>
        </div>
      </section>

      <section className={styles.navigationSheet}>
        <div className={styles.navigationDescription}>
          <div aria-hidden className={styles.navigationLogo}><span /></div>
          <div className={styles.navigationCopy}>
            <h2>Navigation</h2>
            <p>
              Tags label, filter, and hold search parameters — never actions (Button) or
              single-choice selections (Toggle). The same pill adapts across all three roles through
              its icon and state configuration.
            </p>
          </div>
        </div>

        <div className={styles.navigationShowcase}>
          <div className={styles.navigationLeftColumn}>
            <NavigationSpecimen title="Icon_candy" className={styles.iconCandyFrame}>
              <IconCandyGallery />
            </NavigationSpecimen>
            <NavigationSpecimen title="Nav_tab" className={styles.navTabFrame}>
              <NavTab state="enabled" />
              <NavTab state="hover" />
              <NavTab state="selected" />
            </NavigationSpecimen>
          </div>
          <NavigationSpecimen title="Navigation" className={styles.navigationFrame}>
            <Navigation />
          </NavigationSpecimen>
        </div>
      </section>
    </main>
  );
}

const iconCandyTones: IconCandyTone[] = [
  "glaze-blue", "sea-green", "night-haze", "glass",
  "glow-violet", "warm-brick", "bronze", "clear",
];

function IconCandyGallery() {
  return iconCandyTones.map((tone) => <IconCandy key={tone} tone={tone} />);
}

function NavigationSpecimen({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className: string;
  title: string;
}) {
  return (
    <section className={`${styles.navigationComponentFrame} ${className}`}>
      <h3><span aria-hidden>❖</span>{title}</h3>
      {children}
    </section>
  );
}

const segmentPlacements: SegmentIconPlacement[] = ["none", "leading", "trailing", "only"];
const unselectedSegmentStates: SegmentState[] = ["enabled", "hover", "pressed", "disabled"];

function SegmentMatrix() {
  return (
    <div className={styles.segmentMatrix}>
      {segmentPlacements.map((iconPlacement) => (
        <Segment iconPlacement={iconPlacement} key={`selected-${iconPlacement}`} selected />
      ))}
      {unselectedSegmentStates.flatMap((state) => segmentPlacements.map((iconPlacement) => (
        <Segment iconPlacement={iconPlacement} key={`${state}-${iconPlacement}`} state={state} />
      )))}
    </div>
  );
}

const toggleStates: ToggleState[] = ["enabled", "pressed", "disabled"];

function ToggleMatrix() {
  return (
    <div className={styles.toggleMatrix}>
      {toggleStates.flatMap((state) => [false, true].map((isOn) => (
        <Toggle
          aria-label={`${state} ${isOn ? "on" : "off"} toggle`}
          defaultChecked={isOn}
          key={`${state}-${isOn}`}
          state={state}
        />
      )))}
    </div>
  );
}

function ToggleSpecimen({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className: string;
  title: string;
}) {
  return (
    <section className={`${styles.toggleComponentFrame} ${className}`}>
      <h3 className={styles.toggleComponentName}><span aria-hidden>❖</span>{title}</h3>
      {children}
    </section>
  );
}

const tagStates: TagState[] = ["disabled", "enabled", "hover", "pressed", "selected"];

function TagMatrix({ type }: { type: TagType }) {
  const layouts = [
    { leadingIcon: true, subLabel: "24" },
    { leadingIcon: true },
    { trailingIcon: true },
    { leadingIcon: true, trailingIcon: true },
    {},
  ];

  return (
    <div className={styles.tagMatrix}>
      {tagStates.flatMap((state) => layouts.map((layout, index) => (
        <Tag key={`${type}-${state}-${index}`} state={state} type={type} {...layout} />
      )))}
    </div>
  );
}

const tooltipOrigins: TooltipOrigin[] = [
  "top-left",
  "top",
  "top-right",
  "left",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
];

type SpecimenProps = {
  children: ReactNode;
  frameClass: string;
  title: string;
};

function Specimen({ children, frameClass, title }: SpecimenProps) {
  return (
    <section className={styles.inputSpecimen}>
      <h3 className={styles.inputComponentName}><span aria-hidden>❖</span>{title}</h3>
      <div className={`${styles.inputComponentFrame} ${frameClass}`}>{children}</div>
    </section>
  );
}
