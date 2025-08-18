import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const AnnouncementBanner = () => {
    // Banner is always visible - no dismissal functionality
    const isVisible = true;

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
                    <div className="flex items-center">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBanner;
