
import { Sparkles } from "lucide-react";

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
