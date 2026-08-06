"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

export type TooltipOrigin =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

export type TooltipProps = {
  className?: string;
  id?: string;
  originPosition?: TooltipOrigin;
  style?: CSSProperties;
  text?: string;
  tooltipRef?: Ref<HTMLSpanElement>;
};

const originClass: Record<TooltipOrigin, string> = {
  "top-left": styles.topLeft,
  top: styles.top,
  "top-right": styles.topRight,
  left: styles.left,
  right: styles.right,
  "bottom-left": styles.bottomLeft,
  bottom: styles.bottom,
  "bottom-right": styles.bottomRight,
};

export function Tooltip({
  className = "",
  id,
  originPosition = "top-left",
  style,
  text = "Tooltip text",
  tooltipRef,
}: TooltipProps) {
  return (
    <span
      className={`${styles.tooltip} ${originClass[originPosition]} ${className}`}
      id={id}
      ref={tooltipRef}
      role="tooltip"
      style={style}
    >
      {text}
    </span>
  );
}

type TriggerElementProps = {
  "aria-describedby"?: string;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
};

export type TooltipTriggerProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  delay?: number;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  originPosition?: TooltipOrigin;
  text: string;
};

const oppositeOrigin: Record<TooltipOrigin, TooltipOrigin> = {
  "top-left": "bottom-right",
  top: "bottom",
  "top-right": "bottom-left",
  left: "right",
  right: "left",
  "bottom-left": "top-right",
  bottom: "top",
  "bottom-right": "top-left",
};

function getCoordinates(
  anchor: DOMRect,
  tooltip: DOMRect,
  origin: TooltipOrigin,
) {
  const gap = 8;
  const centeredX = anchor.left + (anchor.width - tooltip.width) / 2;
  const centeredY = anchor.top + (anchor.height - tooltip.height) / 2;

  switch (origin) {
    case "top-left":
      return { left: anchor.left, top: anchor.bottom + gap };
    case "top":
      return { left: centeredX, top: anchor.bottom + gap };
    case "top-right":
      return { left: anchor.right - tooltip.width, top: anchor.bottom + gap };
    case "bottom-left":
      return { left: anchor.left, top: anchor.top - tooltip.height - gap };
    case "bottom":
      return { left: centeredX, top: anchor.top - tooltip.height - gap };
    case "bottom-right":
      return { left: anchor.right - tooltip.width, top: anchor.top - tooltip.height - gap };
    case "left":
      return { left: anchor.right + gap, top: centeredY };
    case "right":
      return { left: anchor.left - tooltip.width - gap, top: centeredY };
  }
}

export function TooltipTrigger({
  children,
  defaultOpen = false,
  delay = 400,
  onOpenChange,
  open,
  originPosition = "top",
  text,
}: TooltipTriggerProps) {
  const generatedId = useId();
  const tooltipId = `tooltip-${generatedId.replaceAll(":", "")}`;
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [resolvedOrigin, setResolvedOrigin] = useState(originPosition);
  const [position, setPosition] = useState({ left: -9999, top: -9999 });
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const showAfterDelay = () => {
    clearTimer();
    timerRef.current = setTimeout(() => setOpen(true), delay);
  };

  const hideImmediately = () => {
    clearTimer();
    setOpen(false);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current || !tooltipRef.current) return;

    const anchorRect = anchorRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    let nextOrigin = originPosition;
    let nextPosition = getCoordinates(anchorRect, tooltipRect, nextOrigin);
    const margin = 8;
    const overflows =
      nextPosition.left < margin ||
      nextPosition.top < margin ||
      nextPosition.left + tooltipRect.width > window.innerWidth - margin ||
      nextPosition.top + tooltipRect.height > window.innerHeight - margin;

    if (overflows) {
      nextOrigin = oppositeOrigin[nextOrigin];
      nextPosition = getCoordinates(anchorRect, tooltipRect, nextOrigin);
    }

    setResolvedOrigin(nextOrigin);
    setPosition({
      left: Math.min(Math.max(nextPosition.left, margin), window.innerWidth - tooltipRect.width - margin),
      top: Math.min(Math.max(nextPosition.top, margin), window.innerHeight - tooltipRect.height - margin),
    });
  }, [isOpen, originPosition]);

  const child = Children.toArray(children).find((item) =>
    isValidElement<TriggerElementProps>(item),
  );
  if (!child) return null;

  // cloneElement only composes accessibility and event props; no ref value is read here.
  // eslint-disable-next-line react-hooks/refs
  const trigger = cloneElement(child, {
    "aria-describedby": isOpen ? tooltipId : child.props["aria-describedby"],
    onBlur: (event) => {
      child.props.onBlur?.(event);
      hideImmediately();
    },
    onFocus: (event) => {
      child.props.onFocus?.(event);
      setOpen(true);
    },
    onMouseEnter: (event) => {
      child.props.onMouseEnter?.(event);
      showAfterDelay();
    },
    onMouseLeave: (event) => {
      child.props.onMouseLeave?.(event);
      hideImmediately();
    },
  });

  return (
    <span className={styles.trigger} ref={anchorRef}>
      {trigger}
      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <Tooltip
              className={styles.floating}
              id={tooltipId}
              originPosition={resolvedOrigin}
              style={position}
              text={text}
              tooltipRef={tooltipRef}
            />,
            document.body,
          )
        : null}
    </span>
  );
}
