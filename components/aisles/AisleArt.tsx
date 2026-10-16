/** Illustrazioni editoriali dei reparti; sostituibili con foto dai contenuti. */
export function AisleArt({ icon, className }: { icon: string; className?: string }) {
  const backgrounds: Record<string, string> = {
    cucina: "#dcecf7", tessile: "#f6e3eb", pulizia: "#e0eee9",
    animali: "#f8ebd9", giardino: "#e4eedf", hobby: "#e9e4f6",
  };
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <rect width="400" height="260" fill={backgrounds[icon] ?? "#dcecf7"} />
      <circle cx="295" cy="54" r="89" fill="white" opacity=".35" />
      <ellipse cx="203" cy="222" rx="141" ry="14" fill="#0b2a47" opacity=".08" />
      {icon === "cucina" && <>
        <ellipse cx="262" cy="128" rx="71" ry="76" fill="#fff" />
        <ellipse cx="262" cy="128" rx="54" ry="59" fill="none" stroke="#b8d8ef" strokeWidth="5" />
        <path d="M94 131h133v66a21 21 0 0 1-21 21h-91a21 21 0 0 1-21-21z" fill="#0f6bb4" />
        <path d="M79 142h15m133 0h15" stroke="#0b2a47" strokeWidth="10" strokeLinecap="round" />
        <path d="M88 129q72-60 145 0z" fill="#fff" /><rect x="147" y="94" width="27" height="12" rx="6" fill="#0b2a47" />
        <path d="M113 145v48" stroke="#6ba6d4" strokeWidth="6" strokeLinecap="round" />
        <rect x="265" y="180" width="49" height="39" rx="11" fill="#d11559" />
        <path d="M312 189q27-2 21 19-4 10-21 5" fill="none" stroke="#d11559" strokeWidth="8" />
      </>}
      {icon === "tessile" && <>
        <rect x="80" y="119" width="233" height="98" rx="24" fill="#0f6bb4" />
        <rect x="100" y="74" width="116" height="111" rx="22" transform="rotate(-11 158 130)" fill="#fff" />
        <path d="m117 94 75 67m-75-42 58 53" stroke="#f0b9ce" strokeWidth="9" />
        <rect x="206" y="109" width="105" height="96" rx="20" transform="rotate(10 258 157)" fill="#d11559" />
        <circle cx="258" cy="158" r="10" fill="#f9bbd1" />
        <path d="M84 199h104v27H84z" fill="#c7ddee" /><path d="M84 207h104" stroke="#fff" strokeWidth="4" />
      </>}
      {icon === "pulizia" && <>
        <path d="M106 78h70v29l19 22v75a14 14 0 0 1-14 14h-79a14 14 0 0 1-14-14v-75l18-22z" fill="#fff" />
        <rect x="105" y="67" width="72" height="23" rx="6" fill="#0f6bb4" />
        <rect x="88" y="143" width="107" height="48" fill="#0f6bb4" />
        <path d="m138 154 4 10 11 3-11 4-4 10-3-10-11-4 11-3z" fill="#fff" />
        <path d="M239 110h47v28l15 16v52a12 12 0 0 1-12 12h-53a12 12 0 0 1-12-12v-52l15-16z" fill="#d11559" />
        <path d="M240 108V93h69l-13 15z" fill="#0b2a47" />
        <path d="M247 166h31v28h-31z" fill="#f6d4e1" />
        <path d="m212 61 5 13 14 4-14 5-5 13-4-13-14-5 14-4z" fill="#6e9d89" />
      </>}
      {icon === "animali" && <>
        <path d="M110 169v-60l27-45 30 40q33-9 55 0l30-40 27 45v60q0 38-84 38t-85-38" fill="#bb8966" />
        <path d="m121 111 16-27 17 31m85 0 16-31 16 27" fill="#e8b49b" />
        <ellipse cx="195" cy="163" rx="47" ry="33" fill="#fae4d1" />
        <circle cx="155" cy="141" r="7" fill="#0b2a47" /><circle cx="234" cy="141" r="7" fill="#0b2a47" />
        <path d="m182 158 13 12 14-12z" fill="#0b2a47" /><path d="M195 170v11m0 0q-10 10-18 0m18 0q10 10 18 0" fill="none" stroke="#0b2a47" strokeWidth="3" strokeLinecap="round" />
        <path d="M239 197h88l10 27h-108z" fill="#0f6bb4" />
        <ellipse cx="282" cy="197" rx="44" ry="8" fill="#85b9dd" /><circle cx="84" cy="206" r="19" fill="#d11559" /><path d="M67 201q20-2 25 21" fill="none" stroke="#f3a6c3" strokeWidth="4" />
      </>}
      {icon === "giardino" && <>
        <path d="M150 147h111l-15 72h-80z" fill="#d11559" />
        <rect x="143" y="141" width="126" height="17" rx="5" fill="#b01556" />
        <path d="M206 146V73" stroke="#285d50" strokeWidth="8" />
        <path d="M205 112q-62 5-65-52 61-5 65 52M209 96q-2-55 60-51-1 53-60 51" fill="#599176" />
        <path d="M207 135q5-42 48-35-3 38-48 35" fill="#37735d" />
        <path d="M77 178h47v39H77z" fill="#0f6bb4" /><path d="M78 180q-29-10-33-27l-8 5 15 35 27 10" fill="#0f6bb4" /><path d="M124 182q32-20 31 7t-31 14" fill="none" stroke="#0f6bb4" strokeWidth="8" />
        <path d="M298 145v63" stroke="#0b2a47" strokeWidth="9" strokeLinecap="round" /><path d="M286 146v-19a12 12 0 0 1 24 0v19z" fill="#93adb9" />
      </>}
      {icon === "hobby" && <>
        <rect x="103" y="69" width="135" height="151" rx="10" transform="rotate(-7 170 145)" fill="#0f6bb4" />
        <rect x="129" y="93" width="139" height="127" rx="8" transform="rotate(6 198 156)" fill="#fff" />
        <path d="m155 124 80 9m-81 12 65 8m-69 13 81 9m-82 12 53 6" stroke="#bfd7e9" strokeWidth="5" strokeLinecap="round" />
        <path d="m273 77 14 5-36 119-14-5z" fill="#d11559" /><path d="m237 196 14 5-15 23z" fill="#bb8966" />
        <path d="m300 110 13 6-42 92-13-6z" fill="#ffbd65" /><path d="m258 202 13 6-17 17z" fill="#bb8966" />
        <circle cx="93" cy="192" r="22" fill="#d11559" /><circle cx="93" cy="192" r="10" fill="#f6d3e0" />
      </>}
    </svg>
  );
}
