import Image from "next/image";
import type { ArticleImage } from "@/lib/content";

// Aspect-ratio box reserved before load (no layout shift), object-fit: cover,
// editor focal point as object-position. No background: if a card has no image,
// the card renders text-only instead of a grey box.
export function StoryImage({
  image,
  ratio,
  sizes,
  eager = false,
  className = "",
}: {
  image: ArticleImage;
  /** Tailwind aspect classes, e.g. "aspect-[3/2] lg:aspect-video". */
  ratio: string;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const focal = image.focalPoint;
  return (
    <div className={`relative overflow-hidden ${ratio} ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className="object-cover"
        style={focal ? { objectPosition: `${focal.x * 100}% ${focal.y * 100}%` } : undefined}
      />
    </div>
  );
}
