import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT = [0.16, 1, 0.3, 1];

/**
 * Fades an element up out of a soft blur the first time it scrolls into view.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  blur = 8,
  y = 24,
  as = "div",
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y, filter: `blur(${blur}px)` }
      }
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transitionEnd: { filter: "none" },
            }
      }
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: reduceMotion ? 0.3 : 0.9,
        delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </Component>
  );
}
