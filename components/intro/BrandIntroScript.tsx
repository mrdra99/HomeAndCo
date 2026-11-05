import { brandIntroScriptSource } from "@/lib/brand-intro";

export function BrandIntroScript() {
  return <script dangerouslySetInnerHTML={{ __html: brandIntroScriptSource() }} />;
}
