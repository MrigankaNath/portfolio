"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JetBrains_Mono } from "next/font/google";
import { site } from "@/data/site";

const mono = JetBrains_Mono({ subsets: ["latin"] });

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

const links: NavItem[] = [
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/contact", label: "contact" },
  // { href: "/resume.pdf", label: "resume", external: true },
];

const glow = "[text-shadow:0_0_14px_rgba(237,237,237,0.5)]";

const headerBaseClasses = [
  mono.className,
  "sticky top-0 z-50 border-b",
  "transition-colors duration-300",
].join(" ");

const headerSolidClasses = [
  "border-foreground/10",
  "bg-background/90 backdrop-blur-md",
].join(" ");

const headerClearClasses = "border-transparent bg-transparent";

const navClasses = [
  "mx-auto flex h-24 max-w-7xl items-center justify-between",
  "px-6 sm:px-10 md:h-28 lg:px-16",
].join(" ");

const logoClasses = [
  "text-2xl font-bold tracking-tighter text-foreground",
  "sm:text-3xl md:text-4xl",
].join(" ");

const iconButtonClasses = [
  "-mr-2 p-2 text-foreground/70",
  "transition-colors duration-200 hover:text-foreground",
  "focus-visible:outline focus-visible:outline-2",
  "focus-visible:outline-offset-2 focus-visible:outline-foreground",
].join(" ");

const linkStyles = {
  desktop: {
    base: [
      "group relative inline-block text-base leading-none",
      "tracking-wide transition-colors duration-200 lg:text-lg",
    ].join(" "),
    idle: "text-foreground/50 hover:font-bold hover:text-foreground",
    active: `font-bold text-foreground ${glow}`,
  },
  mobile: {
    base: [
      "block py-3 text-2xl tracking-wide",
      "transition-colors duration-200",
    ].join(" "),
    idle: "text-foreground/50 hover:text-foreground",
    active: `font-bold text-foreground ${glow}`,
  },
};

const underlineClasses = [
  "absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-foreground",
  "scale-x-0 transition-transform duration-300 ease-out",
  "group-hover:scale-x-100",
].join(" ");

const overlayBaseClasses = [
  "fixed inset-0 z-[55] bg-black/60 md:hidden",
  "transition-opacity duration-300",
].join(" ");

const drawerBaseClasses = [
  mono.className,
  "fixed inset-y-0 right-0 z-[60] flex w-4/5 max-w-sm flex-col",
  "border-l border-foreground/10 bg-background md:hidden",
  "transition-transform duration-300 ease-out",
].join(" ");

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

type NavLinkProps = {
  item: NavItem;
  pathname: string;
  variant: "desktop" | "mobile";
  onClick?: () => void;
};

function NavLink({ item, pathname, variant, onClick }: NavLinkProps) {
  const { href, label, external } = item;
  const styles = linkStyles[variant];
  const active =
    !external && (pathname === href || pathname.startsWith(`${href}/`));
  const className = `${styles.base} ${active ? styles.active : styles.idle}`;

  const content = (
    <>
      {label}
      {variant === "desktop" && (
        <span aria-hidden="true" className={underlineClasses} />
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <header
        className={`${headerBaseClasses} ${
          scrolled ? headerSolidClasses : headerClearClasses
        }`}
      >
        <nav aria-label="Main" className={navClasses}>
          <Link href="/" className={logoClasses}>
            {site.brand}
          </Link>

          <ul className="hidden items-center gap-10 md:flex lg:gap-14">
            {links.map((item) => (
              <li key={item.href}>
                <NavLink item={item} pathname={pathname} variant="desktop" />
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            className={`${iconButtonClasses} md:hidden`}
          >
            <MenuIcon />
          </button>
        </nav>
      </header>

      <div
        aria-hidden="true"
        onClick={close}
        className={`${overlayBaseClasses} ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="mobile-menu"
        inert={!open}
        className={`${drawerBaseClasses} ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-24 items-center justify-end px-6 sm:px-10">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className={iconButtonClasses}
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="flex flex-col px-6 sm:px-10">
          {links.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                pathname={pathname}
                variant="mobile"
                onClick={close}
              />
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
