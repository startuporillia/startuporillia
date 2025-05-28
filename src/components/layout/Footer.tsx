import { Sparkles, MessageCircle } from "lucide-react"; // Added MessageCircle for WhatsApp

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container py-8 text-center text-muted-foreground">
        <div className="flex flex-col items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <p className="text-lg font-semibold text-primary">Startup Orillia</p>
        </div>
        <p className="text-sm">
          Fostering innovation and collaboration in Orillia's vibrant entrepreneurial community.
        </p>
        <div className="mt-4 mb-2">
            <a 
                href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-sm text-brand-teal hover:text-brand-teal/80 font-medium"
            >
                <MessageCircle className="h-5 w-5" />
                Join our WhatsApp Group
            </a>
        </div>
        <p className="text-sm mt-1">
          &copy; {currentYear} Startup Orillia. All rights reserved.
        </p>
        <p className="text-xs mt-4">
          Website crafted with ❤️ by Lovable.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
