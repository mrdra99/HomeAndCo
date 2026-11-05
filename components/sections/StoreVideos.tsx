import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { Icon } from "@/components/ui/Icon";
import type { HomeCopy } from "@/lib/content/schemas";

export function StoreVideos({ copy }: { copy: HomeCopy["social"] }) {
  return (
    <section id="video" className="scroll-mt-24 bg-white py-12 sm:py-16" aria-labelledby="video-title">
      <Container size="wide">
        <div className="mb-7 max-w-2xl">
          <h2 id="video-title" className="text-brand-blue-900">{copy.titolo}</h2>
          <p className="mt-3 text-muted">{copy.descrizione}</p>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          <figure className="col-span-2 mx-auto w-full max-w-80 sm:col-span-1">
            <video controls playsInline preload="none" poster={copy.video.poster.src ?? undefined} aria-label={`${copy.video.titolo}. Video con sottotitoli impressi nell’immagine.`} className="aspect-[9/16] w-full bg-black object-contain">
              <source src={copy.video.src} type="video/mp4" />
              <a href={copy.video.src}>Guarda il video del negozio</a>
            </video>
            <figcaption className="mt-3">
              <h3 className="!text-lg text-brand-blue-900">{copy.video.titolo}</h3>
              <p className="mt-1 text-sm text-muted">{copy.video.descrizione}</p>
            </figcaption>
          </figure>
          {copy.reels.map((reel) => (
            <a key={reel.href} href={reel.href} target="_blank" rel="noopener noreferrer" aria-label={`${reel.titolo}: apri il reel su Instagram (nuova scheda)`} className="group mx-auto block w-full max-w-80">
              <SmartImage src={reel.immagine.src} alt={reel.immagine.alt} label={reel.titolo} ratio="9/16" sizes="(min-width: 640px) 30vw, 320px" rounded="rounded-none" />
              <h3 className="mt-3 !text-lg text-brand-blue-900 underline-offset-4 group-hover:underline">{reel.titolo}</h3>
              <span className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm text-muted"><Icon name="instagram" size={17} />Guarda su Instagram<Icon name="external" size={14} /></span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
