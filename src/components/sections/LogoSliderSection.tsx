import { InfiniteSlider } from "@/components/ui/infinite-slider";

const LogoSliderSection = () => {
  const logos = [
    { id: 1, src: "/Startup Logos/1.png", alt: "Startup Logo 1", url: "https://goinvsbl.com" },
    { id: 2, src: "/Startup Logos/2.png", alt: "Startup Logo 2", url: "https://propertybrushai.com" },
    { id: 3, src: "/Startup Logos/3.png", alt: "Startup Logo 3", url: "http://comphub.ca" },
    { id: 4, src: "/Startup Logos/4.png", alt: "Startup Logo 4", url: "https://pics.direct" },
    { id: 5, src: "/Startup Logos/5.png", alt: "Startup Logo 5", url: "https://dailyrabbi.com" },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Startups We've Launched
          </h2>
          <p className="text-muted-foreground">
            Meet some of the innovative companies in our community
          </p>
        </div>

        <InfiniteSlider
          gap={40}
          duration={30}
          durationOnHover={50}
          className="py-8"
        >
          {logos.map((logo) => (
            <a
              key={logo.id}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-24 w-48 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain"
              />
            </a>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
};

export default LogoSliderSection;
