import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowRight } from "lucide-react";

const Navbar = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const navItems = [
    { label: "Events", href: "/events" },
    { label: "Workshops", href: "/workshops" },
    { label: "Projects", href: "/startups" },
    { label: "Contact", href: "/contact" },
  ];

  const closeSheet = () => setSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-teal flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-heading font-bold text-sm">SO</span>
          </div>
          <span className="font-heading font-semibold text-lg text-primary">Startup Orillia</span>
        </Link>

        <nav className="hidden md:flex gap-1 items-center">
          {navItems.map((item) => {
            const baseClasses = "px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg transition-all duration-200 hover:text-primary hover:bg-secondary/80";

            if (item.href.startsWith('/#')) {
              return (
                <a key={item.label} href={item.href} className={baseClasses}>
                  {item.label}
                </a>
              );
            }
            if (item.href.startsWith('/')) {
              return (
                <Link key={item.label} to={item.href} className={baseClasses}>
                  {item.label}
                </Link>
              );
            }
            return (
              <a key={item.label} href={item.href} className={baseClasses}>
                {item.label}
              </a>
            );
          })}
          <Button asChild className="ml-2 bg-brand-orange hover:bg-brand-orange-light text-white group">
            <a
              href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Join WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
        </nav>

        <div className="md:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] flex flex-col">
              <div className="flex flex-col gap-1 py-6 flex-1">
                <Link
                  to="/"
                  onClick={closeSheet}
                  className="flex items-center gap-2.5 mb-6 pb-6 border-b"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-teal flex items-center justify-center">
                    <span className="text-white font-heading font-bold text-sm">SO</span>
                  </div>
                  <span className="font-heading font-semibold text-lg">Startup Orillia</span>
                </Link>

                {navItems.map((item) => {
                  const baseClasses = "text-base font-medium text-foreground transition-colors hover:text-brand-orange py-3 px-2 rounded-lg hover:bg-secondary/50";

                  if (item.href.startsWith('/#')) {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={closeSheet}
                        className={baseClasses}
                      >
                        {item.label}
                      </a>
                    );
                  }
                  if (item.href.startsWith('/')) {
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={closeSheet}
                        className={baseClasses}
                      >
                        {item.label}
                      </Link>
                    );
                  }
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={closeSheet}
                      className={baseClasses}
                    >
                      {item.label}
                    </a>
                  );
                })}

                <Button asChild className="mt-6 bg-brand-orange hover:bg-brand-orange-light text-white">
                  <a
                    href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeSheet}
                    className="flex items-center justify-center gap-2"
                  >
                    Join WhatsApp
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* Logo at bottom of sheet */}
              <div className="pt-6 pb-2 flex justify-center border-t border-border/40">
                <picture>
                  <source srcSet="/images/logo.webp" type="image/webp" />
                  <img
                    src="/images/logo.jpg"
                    alt="Startup Orillia"
                    width="80"
                    height="80"
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-20 rounded-full opacity-90"
                  />
                </picture>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
