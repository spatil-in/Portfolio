import { useRef } from "react";

export default function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
  ...props
}) {
  const ref = useRef(null);

  const handleMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    ref.current.style.setProperty("--mag-x", `${x * 0.12}px`);
    ref.current.style.setProperty("--mag-y", `${y * 0.12}px`);
  };

  const reset = () => {
    ref.current?.style.setProperty("--mag-x", "0px");
    ref.current?.style.setProperty("--mag-y", "0px");
  };
  const sharedProps = {
    ref,
    className: `button-magnetic ${className}`,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onBlur: reset,
    onClick,
    ...props,
  };

  if (href) {
    return <a href={href} {...sharedProps}>{children}</a>;
  }
  return <button type={type} {...sharedProps}>{children}</button>;
}
