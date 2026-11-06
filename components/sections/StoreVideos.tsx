import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { Icon } from "@/components/ui/Icon";
import type { HomeCopy } from "@/lib/content/schemas";
import { REEL_COVER_MAX_CSS_WIDTH, REEL_COVER_MAX_CSS_WIDTH_MOBILE, VIDEO_POSTER_MAX_CSS_WIDTH } from "@/lib/image-rules";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./SectionTitle";

/** Larghezze di visualizzazione: sotto i limiti di nitidezza (poster 320 px, reel 120 px sotto md e 176 px da md). */
const VIDEO_WIDTH = Math.min(240, VIDEO_POSTER_MAX_CSS_WIDTH);
const REEL_WIDTH_MOBILE = Math.min(120, REEL_COVER_MAX_CSS_WIDTH_MOBILE);
const REEL_WIDTH = Math.min(176, REEL_COVER_MAX_CSS_WIDTH);

type Props = {
  copy: HomeCopy["social"];
  /** Profilo Instagram reale (settings.social.instagram). */
  instagramUrl: string;
  /**
   * "full": la sezione ha tutta la riga (testo a sinistra, video e reel a destra da lg).
   * "column": sta in una colonna accanto ad altro (ad esempio la carta fedelta').
   */
  layout?: "full" | "column";
};

/** Video del negozio e due reel, sempre alla larghezza massima consentita dalla loro risoluzione. */
export function StoreVideos({ copy, instagramUrl, layout = "column" }: Props) {
  const full = layout === "full";
  return (
    <section id="video" aria-labelledby="video-title" className="scroll-mt-4">
      <div className={cn(full && "lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-12")}>
        <div>
          <SectionTitle id="video-title" note={copy.descrizione} className={cn("sm:flex-col sm:items-start sm:gap-1", full && "lg:mb-4")}>
            {copy.titolo}
          </SectionTitle>
          <Button href={instagramUrl} variant="secondary" size="md" iconLeft={<Icon name="instagram" size={20} />} className="mb-5 lg:mb-0">
            {copy.seguici}
          </Button>
        </div>
        <div
          className="flex flex-wrap items-start gap-x-4 gap-y-4 lg:gap-x-5"
          style={{ ["--reel-w" as string]: `${REEL_WIDTH_MOBILE}px`, ["--reel-w-sm" as string]: `${REEL_WIDTH}px` }}
        >
          <figure className="w-full" style={{ maxWidth: VIDEO_WIDTH }}>
            <video
              controls
              playsInline
              preload="none"
              poster={copy.video.poster.src ?? undefined}
              aria-label={copy.videoAria.replace("{titolo}", copy.video.titolo)}
              className="aspect-[9/16] w-full rounded-md bg-black object-contain"
            >
              <source src={copy.video.src} type="video/mp4" />
              <a href={copy.video.src}>{copy.videoAlternativa}</a>
            </video>
            <figcaption className="mt-2">
              <h3 className="!text-base text-brand-blue-900">{copy.video.titolo}</h3>
            </figcaption>
          </figure>
          {copy.reels.map((reel) => (
            <a
              key={reel.href}
              href={reel.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.reelAria.replace("{titolo}", reel.titolo)}
              className="group block w-[var(--reel-w)] md:w-[var(--reel-w-sm)]"
            >
              <SmartImage
                src={reel.immagine.src}
                alt={reel.immagine.alt}
                label={reel.titolo}
                ratio="9/16"
                sizes={`(min-width: 768px) ${REEL_WIDTH}px, ${REEL_WIDTH_MOBILE}px`}
                rounded="rounded-md"
                imgClassName="group-hover:scale-100"
              />
              <h3 className="mt-2 !text-base leading-tight text-brand-blue-900 group-hover:underline">{reel.titolo}</h3>
              <span className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-blue-700">
                <Icon name="instagram" size={16} />
                {copy.instagram}
                <Icon name="external" size={13} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
