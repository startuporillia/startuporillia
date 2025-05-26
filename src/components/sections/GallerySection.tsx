
const photos = [
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdyb3VwJTIwbWVldGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60", alt: "Group discussion at a meetup" },
  { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMG1lZXR1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60", alt: "Tech presentation" },
  { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG5ldHdvcmtpbmclMjBldmVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60", alt: "Networking at an event" },
  { src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RhcnR1cCUyMGV2ZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60", alt: "Startup event gathering" },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Moments from Our Meetups</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the vibrant energy and connections made at Startup Orillia gatherings.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className={`animate-fade-in-up ${index === 0 || index === 3 ? 'md:col-span-2' : ''}`} style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
              <img 
                src={photo.src} 
                alt={photo.alt} 
                className="rounded-lg shadow-lg object-cover w-full h-64 hover:scale-105 transition-transform duration-300" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
