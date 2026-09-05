# Handoff: Recipe Box site → GitHub Pages

Static site, no build step. Vermont-farmhouse theme (parchment, barn red, spruce green).

## Files in this folder

```
recipe-site/
├── index.html                                          # recipe index / homepage
├── assets/
│   └── style.css                                       # shared theme, all pages import this
└── recipes/
    └── i-cant-believe-its-not-chicken-grated-tofu.html  # first recipe page
```

## What Claude Code needs to do

1. Copy this whole `recipe-site/` folder into the target repo (root, or a `docs/` folder if that's what GitHub Pages is configured to serve — check repo Settings → Pages first).
2. `git add`, commit (e.g. "Add recipe index + first recipe: grated tofu"), and push to the branch GitHub Pages serves (usually `main` or `gh-pages`).
3. If Pages isn't enabled yet on the repo: enable it in Settings → Pages, source = the branch/folder used above.
4. Fonts (Fraunces + Karla) load from Google Fonts via the `@import` in `style.css` — no local font files needed, works fine once live.

## Adding future recipes (pattern to repeat)

1. Copy `recipes/i-cant-believe-its-not-chicken-grated-tofu.html` as a template for the new recipe.
2. Update: `<title>`, meta description, `.recipe-title`, `.recipe-byline` (name + source link), field-notes paragraph, `.stat-row` values, `.ingredients` list, `.steps` list, `.notes-box`.
3. Add a new `<li>` entry to `index.html`'s `.recipe-list`, matching the existing pattern (title link, tags, byline meta).
4. Keep `assets/style.css` as the single shared stylesheet — don't fork per-recipe styles.

## Design notes (for consistency if extending)

- Palette: cream `#F1E8D2`, barn red `#8A3324`, spruce `#33462E`, maple `#6B4A32`, mustard `#C89A3C`, ink `#2A2420`.
- Type: Fraunces (display/headings), Karla (body).
- Ingredients render as a checklist (open squares); steps render as a numbered sequence (circled numerals) — keep that distinction since ingredients are a checklist, not a sequence.
