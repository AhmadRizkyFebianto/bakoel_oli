interface PageBannerProps {
  title: React.ReactNode;
  description?: string;
  height?: string;
}

export default function PageBanner({
  title,
  description,
  height = "h-64",
}: PageBannerProps) {
  return (
    <section
      className={`relative ${height} flex items-center overflow-hidden mb-12`}
    >
      <img
        src="/assets/headerBG.png"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
        alt="Banner"
      />
      <div className="container mx-auto px-6 relative z-10 text-white text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-gray-300 max-w-2xl mx-auto">{description}</p>
        )}
      </div>
    </section>
  );
}
