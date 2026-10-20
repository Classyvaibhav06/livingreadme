import { useCallback, useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ResizableNavbar";
import { CandyLink } from "./CandyButton";

const APP_URL = import.meta.env.VITE_APP_URL ?? window.location.origin;

const NAV_LINKS = [
  { name: "How it works", link: "/#how-it-works" },
  { name: "Testimonials", link: "/#testimonials" },
  { name: "Features", link: "/#features" },
];

export default function LandingNavigation({ overPhoto = true }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const { scrollY } = useScroll();
  const [onPhoto, setOnPhoto] = useState(overPhoto);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = overPhoto && latest <= 100;
    setOnPhoto((prev) => (prev === next ? prev : next));
  });

  const invertedLogo = "[&_.wordmark]:text-white";

  return (
    <Navbar className="fixed inset-x-0 top-0 z-50">
      {/* Desktop */}
      <NavBody className={onPhoto ? invertedLogo : undefined}>
        <NavbarLogo />
        <NavItems
          items={NAV_LINKS}
          className={
            onPhoto
              ? "[&_a]:text-white [&_a:hover]:text-white [&_a>div]:bg-white/20"
              : undefined
          }
        />
        <div className="relative z-20 flex transform-gpu items-center">
          <CandyLink href={`${APP_URL}/login`} className="px-6 py-2.5 text-sm">
            Get Started
          </CandyLink>
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav
        className={
          onPhoto
            ? "[&>div:first-child_.wordmark]:text-white [&>div:first-child_button]:text-white"
            : undefined
        }
      >
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={mobileOpen} onClose={closeMobile}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.link}
              onClick={closeMobile}
              className="hover:text-primary w-full rounded-lg px-3 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-50 active:bg-slate-100"
            >
              {link.name}
            </a>
          ))}
          <div className="mt-2 flex w-full flex-col">
            <CandyLink
              href={`${APP_URL}/login`}
              className="w-full"
              onClick={closeMobile}
            >
              Get Started
            </CandyLink>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
