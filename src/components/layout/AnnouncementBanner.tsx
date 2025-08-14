import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const AnnouncementBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if banner was dismissed
        const isDismissed = localStorage.getItem("pitch-day-banner-dismissed");
        if (!isDismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("pitch-day-banner-dismissed", "true");
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-brand-orange to-brand-teal text-white">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Rocket className="h-5 w-5 flex-shrink-0" />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <span className="font-semibold text-sm sm:text-base">
                                🚀 Announcing Startup Orillia Pitch Day
                            </span>
                            <span className="text-xs sm:text-sm opacity-90">
                                — apply to pitch or join the panel
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            asChild
                        >
                            <Link to="/pitch-day">
                                Learn more & apply
                            </Link>
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 p-1 h-8 w-8"
                            onClick={handleDismiss}
                            aria-label="Dismiss announcement"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBanner;
