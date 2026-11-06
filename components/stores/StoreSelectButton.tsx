"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useSelectedStoreId } from "./useSelectedStore";

type Props = { storeId: string; labelOn: string; labelOff: string };

/** «Imposta come il tuo negozio»: stessa scelta (localStorage) del selettore in testata. Neutro fino al mount. */
export function StoreSelectButton({ storeId, labelOn, labelOff }: Props) {
  const [savedId, select] = useSelectedStoreId();
  const on = savedId === storeId;
  return (
    <Button
      variant={on ? "ghost" : "outline"}
      size="sm"
      onClick={() => select(storeId)}
      aria-pressed={on}
      iconLeft={on ? <Icon name="check" size={16} /> : undefined}
    >
      {on ? labelOn : labelOff}
    </Button>
  );
}
