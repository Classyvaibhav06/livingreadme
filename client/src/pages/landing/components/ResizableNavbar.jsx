import { cn } from "../lib/utils";
import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

const SURFACE =
  "bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.04),0_4px_20px_rgba(34,42,53,0.10)]";

const RESIZE_TRANSITION = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

export const Navbar = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 100;
    setVisible((prev) => (prev === next ? prev : next));
  });

  return (
    <motion.nav
      ref={ref}
      aria-label="Main"
      style={{ willChange: "transform", transform: "translateZ(0)" }}
      className={cn("sticky inset-x-0 top-20 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child,
      )}
    </motion.nav>
  );
};

export const NavBody = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        width: visible ? "60%" : "100%",
        y: visible ? 16 : 0,
      }}
      transition={RESIZE_TRANSITION}
      style={{ minWidth: "720px", contain: "layout" }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 transition-colors duration-300 lg:flex",
        visible && SURFACE,
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="hover:text-primary relative rounded-full px-4 py-2 text-slate-600 transition-colors"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-gray-100"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        width: visible ? "92%" : "100%",
        y: visible ? 12 : 0,
      }}
      transition={RESIZE_TRANSITION}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between rounded-2xl bg-transparent px-3 py-2 transition-colors duration-300 lg:hidden",
        visible && SURFACE,
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-nav-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-2 rounded-2xl bg-white px-4 py-6 shadow-[0_8px_32px_rgba(34,42,53,0.15)]",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-menu"
      className="cursor-pointer rounded-lg p-2 text-slate-600 transition-colors hover:text-slate-900 active:bg-slate-100"
    >
      {isOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="/"
      aria-label="LivingREADME home"
      className="relative z-20 mr-4 flex shrink-0 transform-gpu items-center gap-2 rounded-lg px-2 py-1 text-sm font-normal text-black"
    >
      <img src="/mascot-bust.png" alt="" className="h-8 w-auto md:h-9" />
      <span className="wordmark font-display text-lg font-semibold tracking-tight text-slate-900 transition-colors md:text-xl">
        LivingREADME
      </span>
    </a>
  );
};
