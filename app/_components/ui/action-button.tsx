import { forwardRef, type ButtonHTMLAttributes } from "react";

type ActionButtonVariant = "primary" | "secondary" | "ghost" | "segment";
type ActionButtonSize = "compact" | "regular";

export const ActionButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ActionButtonVariant;
    size?: ActionButtonSize;
  }
>(function ActionButton(
  {
    variant = "secondary",
    size = "regular",
    className = "",
    type = "button",
    ...props
  },
  ref,
) {
  const classes = [
    "action-button",
    `action-button--${variant}`,
    `action-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button {...props} ref={ref} type={type} className={classes} />;
});
