interface ParallaxBannerProps {
  imageUrl: string;
  heightClass?: string;
  children?: React.ReactNode;
}

export function ParallaxBanner({ imageUrl, heightClass = "h-[50vh] min-h-[400px]", children }: ParallaxBannerProps) {
  return (
    <section className={`relative w-full ${heightClass} bg-slate-900 overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        <img src={imageUrl} alt="Banner" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2A28] via-[#1C2A28]/40 to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-end">{children}</div>
    </section>
  );
}
