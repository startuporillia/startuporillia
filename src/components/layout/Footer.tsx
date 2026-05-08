import { MessageCircle, Linkedin, Mail, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { LUMA_CALENDAR_URL, WHATSAPP_GROUP_URL } from "@/lib/links";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center md:justify-start gap-4 text-center sm:text-left">
            <picture>
              <source srcSet="/images/logo.webp" type="image/webp" />
              <img
                src="/images/logo.jpg"
                alt="Startup Orillia"
                width="80"
                height="80"
                loading="lazy"
                decoding="async"
                className="w-20 h-20 rounded-full flex-shrink-0"
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
          </div>

          {/* Join */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-primary">Stay in the loop</span>
            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20 px-4 py-2 rounded-full font-medium transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Group
            </a>
            <a
              href={LUMA_CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 px-4 py-2 rounded-full font-medium transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Follow on Luma
            </a>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-sm font-medium text-primary">Get in Touch</span>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 px-4 py-2 rounded-full font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact form
            </Link>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/davecap/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 px-3 py-1.5 rounded-full font-medium transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Startup Orillia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
