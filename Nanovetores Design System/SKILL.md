---
name: nanovetores-design
description: Use this skill to generate well-branded interfaces and assets for Nanovetores (a Givaudan company), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and component patterns for prototyping.
user-invocable: true
---

# Nanovetores Design Skill

Read `README.md` in this skill folder first — it has the full brand context, content fundamentals, visual foundations and iconography rules. Then explore:

- `colors_and_type.css` — all color, type, spacing, radius, shadow and motion tokens. Import it at the top of any HTML artifact.
- `assets/logos/` — all official Nanovetores and `Givaudan | NANOVETORES` lockups. **Always copy these in; never redraw the logo or symbol.**
- `preview/` — small reference cards showing the system in use (colors, type, components, hero composition). Good source material when composing new layouts.

## When making visual artifacts (slides, mocks, throwaway prototypes)

1. Copy `colors_and_type.css` and `assets/logos/` into your output folder.
2. Link the stylesheet, use the CSS variables (don't hard-code hex values), and use real logo PNGs.
3. Respect the brand's restrained tone: deep blue + turquoise + gray-blue, generous whitespace, no emoji, no decorative gradients beyond the four documented ones.
4. For icons, link Lucide via CDN unless you have a better internal set.

## When working in production code

Read the rules in `README.md` (CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, ICONOGRAPHY) and become an expert in designing with this brand. Lift hex values, type rules, spacing tokens, and motion easings exactly as documented.

## When invoked without other guidance

Ask the user what they want to build or design (a slide, a landing page, an internal tool screen, a product mock). Ask 3–5 clarifying questions about audience, surface, and whether they want to co-brand with Givaudan. Then act as an expert designer who outputs HTML artifacts or production code, depending on the need.

## Known gaps

- **No specified brand font.** We use Saira (display) and Inter (body) as Google Fonts substitutes. If real font files become available, drop them into `fonts/` and update `colors_and_type.css`.
- **No icon system.** We default to Lucide. If a Nanovetores icon set surfaces, swap it in.
- **No product UI / codebase / Figma.** No `ui_kits/` exist yet. Ask the user for product surfaces if they want UI kits built.
