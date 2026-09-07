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

## Recipe intake

Recipes arrive two ways, both producing the same outcome (page + index entry + notification email to jim.silvia@gmail.com and mjlevy718@gmail.com + commit/push):
- **Email**: scanned/photographed recipe cards sent to jim.silvia@gmail.com from Jim or Melissa, picked up by the automated mail-check pipeline (daily cloud routine + local high-frequency loop during active scanning sessions). Tracked via `.mail-check-state.json`.
- **Direct upload in a Claude Code chat**: a photo pasted straight into the conversation. Process it immediately and identically to an emailed scan — build the themed page, add the index entry, save the source image under `scans/`, send the notification email, commit, and push. Don't wait for the mail pipeline to pick it up; it never will, since it didn't arrive by email.
- **A URL pasted in chat** (e.g. a link to a recipe blog): fetch it, extract the full recipe, and process it the same way as the other two paths — same page, index entry, notification email, commit, push.

The household is vegetarian (no meat) — seafood is fine, but never add or suggest a meat recipe.

## Adding future recipes (pattern to repeat)

1. Copy `recipes/i-cant-believe-its-not-chicken-grated-tofu.html` as a template for the new recipe.
2. Update: `<title>`, meta description, `.recipe-title`, `.recipe-byline` (name + source link), field-notes paragraph, `.stat-row` values, `.ingredients` list, `.steps` list, `.notes-box`.
3. **Pull an image.** Every recipe should have at least one photo if one can reasonably be gotten:
   - Scanned/photographed recipe card (email or direct chat upload): save the source image under `scans/<slug>.jpg`. Downsize it for web first (e.g. `sips -Z 1400 --setProperty formatOptions 70 file.jpg`) — originals from phone cameras run 3-4MB, compressed versions should land well under 500KB.
   - Recipe from a URL: fetch the source's main recipe photo (often the `og:image` meta tag) and save it under `images/<slug>.jpg`.
   - Add it to the page with `<div class="recipe-photos"><figure><img src="../scans-or-images/<slug>.jpg" alt="..."><figcaption>...</figcaption></figure></div>`, placed right after `.recipe-byline` and before `.field-notes`.
   - If no photo is available, skip it — never fabricate or stock-photo a placeholder.
4. **Preserve handwritten notes.** If a scanned card has margin notes, ratings, or dates written on it, transcribe them into the `.notes-box` rather than discarding them — that's real provenance worth keeping.
5. Add a new `<li data-tags="...">` entry to `index.html`'s `.recipe-list`, matching the existing pattern (title link, tags, byline meta). The `data-tags` attribute (lowercase, hyphenated, space-separated) drives the search/filter bar on the index — reuse existing tag values where they fit (see the `<script>` block in `index.html` for how filtering works) rather than inventing near-duplicates.
6. Keep `assets/style.css` as the single shared stylesheet — don't fork per-recipe styles.

## Design notes (for consistency if extending)

- Palette: cream `#F1E8D2`, barn red `#8A3324`, spruce `#33462E`, maple `#6B4A32`, mustard `#C89A3C`, ink `#2A2420`.
- Type: Fraunces (display/headings), Karla (body).
- Ingredients render as a checklist (open squares); steps render as a numbered sequence (circled numerals) — keep that distinction since ingredients are a checklist, not a sequence.
- Recipe photos use `.recipe-photos` (a flex row of one or more `<figure>`s) — see `assets/style.css` for the rules.
- The index page (`index.html`) has a live search box and tag-filter chips built from every `<li>`'s `data-tags` attribute via a small inline `<script>` at the bottom of the file — no build step, no dependency.
