"use client";

import type { ImageLoaderProps } from "next/image";
import images from "./image-manifest.json";
import sizes from "./image-sizes.json";

const manifest: Record<string, { prefix: string; width: number }> = images;
const widths = [...sizes.imageSizes, ...sizes.deviceSizes].sort((a, b) => a - b);

/** Resized at build time, with content hashes so replacements never reuse stale bytes. */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const image = manifest[src];
  if (!image) return src;
  const requested = widths.find((size) => size >= width) ?? image.width;
  return `${image.prefix}-${Math.min(requested, image.width)}.webp`;
}
