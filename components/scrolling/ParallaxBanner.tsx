interface ParallaxBannerProps {
  imageUrl: string
  heightClass?: string
  children?: React.ReactNode
}

export function ParallaxBanner({
  imageUrl,
  heightClass = "h-[50vh] min-h-[400px]",
  children,
}: ParallaxBannerProps) {
  return (
    <section
      className={`relative w-full ${heightClass} overflow-hidden bg-slate-900`}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt="Banner"
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2A28] via-[#1C2A28]/40 to-transparent" />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end">
        {children}
      </div>
    </section>
  )
}
