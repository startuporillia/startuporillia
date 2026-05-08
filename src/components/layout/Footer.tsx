import { MessageCircle, Mail, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { LUMA_CALENDAR_URL, WHATSAPP_GROUP_URL } from "@/lib/links";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      label: "WhatsApp Group",
      href: WHATSAPP_GROUP_URL,
      external: true,
      icon: <MessageCircle className="h-4 w-4" />,
      className: "bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20",
    },
    {
      label: "Follow on Luma",
      href: LUMA_CALENDAR_URL,
      external: true,
      icon: <Calendar className="h-4 w-4" />,
      className: "bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20",
    },
    {
      label: "Contact",
      href: "/contact",
      external: false,
      icon: <Mail className="h-4 w-4" />,
      className: "bg-secondary text-primary hover:bg-secondary/70",
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container py-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand (left) */}
          <Link
            to="/"
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-center sm:text-left group"
            aria-label="Startup Orillia home"
          >
            <picture>
              <source srcSet="/images/logo.webp" type="image/webp" />
              <img
                src="/images/logo.jpg"
                alt="Startup Orillia"
                width="64"
                height="64"
                loading="lazy"
                decoding="async"
                className="w-16 h-16 rounded-full flex-shrink-0 transition-transform group-hover:scale-105"
              />
            </picture>
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-semibold text-lg text-primary leading-tight">
                Startup Orillia
              </span>
              <p className="text-sm text-muted-foreground leading-snug mt-1">
                For people building interesting things in Orillia.
              </p>
            </div>
          </Link>

          {/* Links (right) */}
          <nav className="flex flex-wrap items-center justify-center md:justify-end gap-2">
            {links.map((link) => {
              const baseClasses = `inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium transition-colors ${link.className}`;
              return link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseClasses}
                >
                  {link.icon}
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.href} className={baseClasses}>
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Startup Orillia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
