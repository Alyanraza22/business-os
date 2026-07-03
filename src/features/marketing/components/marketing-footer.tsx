import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { siteConfig } from "@/config/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Workflow", href: "/#workflow" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Changelog", href: "/changelog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Get started", href: "/login" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

/** Public marketing footer. Links resolve to on-page anchors and live routes. */
export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-6">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <Brand href="/" />
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            {siteConfig.description}
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <h3 className="text-foreground text-sm font-semibold">
              {column.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <nav className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
