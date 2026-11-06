import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import homeJson from "../../content/home.json";
import { HomeCopySchema } from "../content/schemas";
import {
  REEL_COVER_MAX_CSS_WIDTH,
  REEL_COVER_MAX_CSS_WIDTH_MOBILE,
  VIDEO_POSTER_MAX_CSS_WIDTH,
  isSharpAt,
  maxDisplayWidth,
  maxDisplayWidthAtDpr,
} from "../image-rules";

const width = async (src: string) => (await sharp(join(process.cwd(), "public", src)).metadata()).width ?? 0;

describe("regola: larghezza mostrata <= larghezza intrinseca / 2", () => {
  it("calcola il limite", () => {
    expect(maxDisplayWidth(360)).toBe(180);
    expect(isSharpAt(360, 180)).toBe(true);
    expect(isSharpAt(360, 320)).toBe(false);
  });
  const social = HomeCopySchema.parse(homeJson).social;
  it("le copertine dei reel sono mostrate entro il limite", async () => {
    for (const reel of social.reels) {
      expect(isSharpAt(await width(reel.immagine.src!), REEL_COVER_MAX_CSS_WIDTH), reel.immagine.src!).toBe(true);
    }
  });
  it("sotto sm le copertine dei reel non superano la risoluzione di un telefono 3x", async () => {
    expect(REEL_COVER_MAX_CSS_WIDTH_MOBILE).toBeLessThanOrEqual(120);
    for (const reel of social.reels) {
      const intrinsic = await width(reel.immagine.src!);
      expect(REEL_COVER_MAX_CSS_WIDTH_MOBILE, reel.immagine.src!).toBeLessThanOrEqual(maxDisplayWidthAtDpr(intrinsic, 3));
    }
  });
  it("il poster del video e' mostrato entro il limite", async () => {
    expect(isSharpAt(await width(social.video.poster.src!), VIDEO_POSTER_MAX_CSS_WIDTH)).toBe(true);
  });
});
