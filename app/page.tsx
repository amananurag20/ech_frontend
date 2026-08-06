import { Button, type ButtonState, type ButtonVariant } from "@/components/Button";
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
    </main>
  );
}
