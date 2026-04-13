import { MessageCircle, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-teal flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">SO</span>
              </div>
              <span className="font-heading font-semibold text-lg text-primary">Startup Orillia</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              For founders and builders who care about shipping, and doing it together.
            </p>
          </div>

          {/* Join */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-primary">Join the Community</span>
            <a
              href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20 px-4 py-2 rounded-full font-medium transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Group
            </a>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-sm font-medium text-primary">Get in Touch</span>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Questions? Reach out to Dave Caplan
            </p>
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
