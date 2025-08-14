import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Users, Lightbulb, Calendar, Clock, MapPin, Mail, Rocket, Target, Handshake, Award, Shield, Eye } from "lucide-react";
import { useEffect, useState } from "react";

const PitchDay = () => {
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

    // Google Form URL for Pitch Day applications
    const PITCH_DAY_FORM_URL = "https://forms.gle/Nz69QtLxs92UjWLj8";

    // Set page title and meta description
    useEffect(() => {
        document.title = "Startup Orillia — Pitch Day | Apply to Pitch or Join the Panel";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Showcase your startup, get feedback from local angels and experienced founders, and potentially raise money. Apply now to pitch or join our expert panel.');
        }
    }, []);

    const aboutPoints = [
        "Showcase your startup to the local entrepreneurial community",
        "Get valuable feedback from experienced founders and angel investors",
        "Build connections with potential partners and mentors",
        "Gain exposure and validation for your business idea",
        "Potentially raise funding from local investors"
    ];

    const faqs = [
        {
            question: "Who can apply to pitch?",
            answer: "Any founder or team with an MVP or traction is welcome to apply. If you're still in the idea stage, you can opt for 'Showcase Only' to present without seeking investment."
        },
        {
            question: "What are the selection criteria?",
            answer: "We prioritize teams with working prototypes, early customers, or clear market validation. However, we also welcome promising ideas in the 'Showcase Only' category."
        },
        {
            question: "Is my intellectual property safe?",
            answer: "This is a public pitch event—only share what you're comfortable with. Consider your pitch as a public presentation and protect any sensitive information accordingly."
        },
        {
            question: "What does 'Showcase Only' mean?",
            answer: "If you're not ready to raise money but want to present your idea, you can choose this option. You'll still get feedback and networking opportunities without the pressure of fundraising."
        },
        {
            question: "What's the timeline for the event?",
            answer: "Date and venue are still being finalized. Once you apply, we'll follow up by email with details as soon as they're confirmed."
        },
        {
            question: "Can I join as a panel participant instead?",
            answer: "Absolutely! We're looking for local angel investors, experienced founders, and business owners to provide feedback and potentially invest. Apply and select 'Join the panel' from the form options."
        },
        {
            question: "Can I just attend to watch and network?",
            answer: "Yes! If you're not ready to pitch or join the panel, you can select 'Spectate' from the form options. This is perfect for anyone interested in learning about local startups and networking with the community."
        },
        {
            question: "What should I prepare for my pitch?",
            answer: "Prepare a 7-minute presentation covering your problem, solution, market opportunity, business model, and ask. Focus on what makes your startup unique and why you're the right team."
        }
    ];

    return (
        <>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/20 py-20 md:py-32">
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-6">
                        <Badge variant="outline" className="text-base flex items-center gap-2 py-2 px-4 border-brand-orange text-brand-orange hover:bg-brand-orange/10 mx-auto mb-4">
                            <Rocket className="h-5 w-5" /> New Event
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Startup Orillia — <span className="font-handcrafted bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-teal">Pitch Day</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        Showcase your startup, get feedback from local angels and experienced founders, and potentially raise money.
                    </p>
                    <p className="text-base text-muted-foreground mb-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <strong>Date & venue:</strong> TBD. We'll follow up by email.
                    </p>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white group" asChild>
                            <a href="#registration">
                                Apply Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">About Pitch Day</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our inaugural Pitch Day brings together Orillia's most promising startups with the community's most experienced entrepreneurs and investors.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {aboutPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                                </div>
                                <p className="text-sm text-muted-foreground">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who It's For Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Who It's For</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="border-brand-orange/20 hover:border-brand-orange/40 transition-colors">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Users className="h-6 w-6 text-brand-orange" />
                                    <CardTitle className="text-xl">Founders & Teams</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-muted-foreground">Perfect for startups with:</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-brand-orange" />
                                        MVP or early traction
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-brand-orange" />
                                        Clear market opportunity
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Award className="h-4 w-4 text-brand-orange" />
                                        Option for "Showcase Only"
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Handshake className="h-6 w-6 text-brand-teal" />
                                    <CardTitle className="text-xl">Panel Participants</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-muted-foreground">We're seeking:</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-brand-teal" />
                                        Local angel investors
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Award className="h-4 w-4 text-brand-teal" />
                                        Experienced founders
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Handshake className="h-4 w-4 text-brand-teal" />
                                        Business owners & mentors
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Event Format Section */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Event Format</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A structured evening of pitches, feedback, and networking.
                        </p>
                    </div>
                    <div className="max-w-2xl mx-auto">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                                <div className="flex-shrink-0 w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-brand-orange" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary">Pitch Format</h3>
                                    <p className="text-sm text-muted-foreground">7-minute pitch + 5-minute Q&A per startup</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                                <div className="flex-shrink-0 w-12 h-12 bg-brand-teal/10 rounded-full flex items-center justify-center">
                                    <Users className="h-6 w-6 text-brand-teal" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary">Panel Feedback</h3>
                                    <p className="text-sm text-muted-foreground">Expert panel provides constructive feedback and insights</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Handshake className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary">Networking</h3>
                                    <p className="text-sm text-muted-foreground">Open networking session after all pitches</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration Section */}
            <section id="registration" className="py-16 md:py-24 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Apply Now</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Ready to showcase your startup or join our expert panel? Start your application below.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {/* Typeform Embed */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-primary">Application Form</h3>
                                <p className="text-sm text-muted-foreground">Tell us about yourself and your startup or background</p>
                            </div>
                            <div className="relative min-h-[600px]">
                                {!isIframeLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto mb-4"></div>
                                            <p className="text-muted-foreground">Loading application form...</p>
                                        </div>
                                    </div>
                                )}
                                <iframe
                                    src={PITCH_DAY_FORM_URL}
                                    width="100%"
                                    height="600"
                                    frameBorder="0"
                                    className="w-full"
                                    onLoad={() => setIsIframeLoaded(true)}
                                    title="Pitch Day Application Form"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Fallback CTA */}
                        <div className="text-center">
                            <Button size="lg" variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange/10" asChild>
                                <a href={PITCH_DAY_FORM_URL} target="_blank" rel="noopener noreferrer">
                                    Open Application Form in New Tab
                                </a>
                            </Button>
                            <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
                                We'll only use your information for event coordination and will never share it with third parties.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Questions?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Have questions about Pitch Day that aren't answered above? We'd love to hear from you.
                    </p>
                    <Button size="lg" variant="outline" className="border-brand-teal text-brand-teal hover:bg-brand-teal/10" asChild>
                        <a href="mailto:hello@startuporillia.ca">
                            <Mail className="mr-2 h-5 w-5" />
                            Contact Us
                        </a>
                    </Button>
                </div>
            </section>
        </>
    );
};

export default PitchDay;
