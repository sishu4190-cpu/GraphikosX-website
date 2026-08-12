# Industry Image Requirements

## Current state (as shipped in Phase 2H)

No photography was added in this phase. Every industry detail page currently
differentiates itself visually using **SVG motifs + CSS/motion only**
(`StyleMotif.tsx`, cursor atmosphere, card system, sector-specific copy) —
never third-party stock photography and never a placeholder/fake image. This
was a deliberate decision: the spec explicitly prohibits hotlinked third-party
photography and fabricated/generic stock imagery, and no real photography of
GraphikosX's own client work, offices, or team was supplied for this phase.

`public/` currently contains only `brand/`, `og/`, and `founder/` — there is
no `public/images/industries/` directory yet. This is expected and does not
break anything: no component references a missing path, so there is no broken
`<Image>`/404 risk anywhere on the site today.

This document specifies exactly what to drop in, where, and at what
dimensions, so that real photography can be added later as a pure content
update with no code changes beyond wiring a small `<Image>` block into
`IndustryHero.tsx` (and optionally `IndustryChallenges.tsx` / a future visual
band) per industry.

## Where images would slot in

Two slots are worth planning for per industry:

1. **Hero side/background image** — sits in `IndustryHero.tsx`, to the right
   of (or behind, masked, at low opacity, mirroring the current `StyleMotif`
   treatment) the headline. This is the highest-impact slot: it's what makes
   the "if I removed the industry name from the hero, would you still know
   which sector this is?" test pass on sight.
2. **Secondary supporting image** — an optional masked/parallax band lower on
   the page (near "We Understand Your Industry" or the transformation
   section), used sparingly per the spec's explicit instruction not to place
   a full photo behind every paragraph.

Both slots should be implemented with `next/image`, lazy-loaded (`loading="lazy"`,
no `priority` except possibly the hero image on LCP-critical routes), and
always paired with descriptive, non-generic `alt` text (never `alt=""` unless
the image is purely decorative and already described in adjacent text).

## Per-industry asset list

All paths are relative to `public/images/industries/<slug>/`. Recommended
format: `.jpg` (or `.webp`), sRGB, no embedded text/logos (headline text is
set in HTML, not baked into the image).

| Slug | Display Name | Hero image (`hero.jpg`) | Secondary image (`secondary.jpg`) | Subject guidance |
|---|---|---|---|---|
| `healthcare` | Doctors & Clinics | 1600×1200, landscape | 1200×1600, portrait | Clean, modern clinical environment — reception desk, consultation room, or a doctor at work (never a stock "handshake" or generic stethoscope close-up). No patient faces without model releases. |
| `real-estate` | Real Estate | 1600×1200, landscape | 1200×1600, portrait | A real project/property exterior or interior — architectural, aspirational, not a generic "for sale" sign. Twilight or golden-hour exterior shots read well against the dark sections. |
| `education-coaching` | Education & Coaching | 1600×1200, landscape | 1200×1600, portrait | A learning environment, cohort/classroom energy, or a coach presenting — avoid generic "laptop + coffee" stock imagery. |
| `jewellery-wedding` | Jewellery & Wedding | 1600×1200, landscape | 1200×1600, portrait | Macro/product-style shot of a piece or a showroom display — polished, high-contrast, benefits from the luxury faceted-gem motif already on the page. Avoid stock bridal-couple imagery. |
| `industrial-manufacturing-chemicals` | Industrial Manufacturing & Chemicals | 1600×1200, landscape | 1200×1600, portrait | Real facility/plant floor, equipment, or process shot — technical and credible, not a generic "factory silhouette" stock photo. |
| `legal-professional-services` | Legal, CA & Professional Services | 1600×1200, landscape | 1200×1600, portrait | Office/consultation environment conveying precision and trust — avoid gavel/scales-of-justice clichés. |
| `fitness-wellness` | Gyms & Fitness | 1600×1200, landscape | 1200×1600, portrait | Real gym floor/studio, equipment, or class energy — avoid generic stock "person running" imagery. |
| `hospitality` | Cafes & Restaurants | 1600×1200, landscape | 1200×1600, portrait | Interior ambience, plating, or the space itself — avoid generic "hands holding coffee cup" stock shots. |
| `architecture-interior` | Architecture & Interior | 1600×1200, landscape | 1200×1600, portrait | A completed space/render — composition and light are the differentiator; pairs well with the page's parallax/masking treatment. |
| `automotive-ev` | Automobile & EV | 1600×1200, landscape | 1200×1600, portrait | Vehicle/showroom/charging-infrastructure shot with a sense of motion or precision — pairs with the kinetic speed-trail motif already on the page. |

## Implementation note for whoever adds real photography later

In `IndustryHero.tsx`, wrap the new `<Image>` in the same mask/opacity
treatment already used for `<StyleMotif>` so the motif and the photo can
coexist (motif as a subtle graphic accent, photo as the dominant visual), or
replace the motif's container with the photo once available and keep the
motif as a smaller accent element. Do not remove `StyleMotif` outright for
industries where no photography is ever supplied — it is the graceful
fallback that keeps every page visually differentiated today.

No other code changes are required to add these images later: the data model
(`IndustryDetail` in `industry-details.ts`) can take an optional
`heroImage?: { src: string; alt: string }` field when this is ready, wired
through to `IndustryHero.tsx` with a conditional render.
