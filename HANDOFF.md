# Handoff: Recipe Box site → GitHub Pages

Static site, no build step. Vermont-farmhouse theme (parchment, barn red, spruce green). As of 2026-09-08 the site has 26 recipes and is fully automated: recipes and cook-log entries arrive by email, get parsed and published without a human in the loop, and everyone gets notified.

## System overview

| Piece | Where |
|---|---|
| Source repo | https://github.com/vtjim/recipes (public, owned by GitHub user `vtjim`) |
| Live site | https://vtjim.github.io/recipes/ |
| Pages config | Settings → Pages, source = `main` branch, root (`/`) — already enabled, no build step |
| Local working copy | `/Users/jim/dev/recipes/recipe-site` (this folder is the repo root, `git remote -v` → `origin` = the URL above) |
| Owner accounts watched | jim.silvia@gmail.com (primary), mjlevy718@gmail.com and ymlevy@yellowwood.org (Melissa) |

Everything below this point — the two cloud routines, the state file, the reply commands — is already live. If you're picking this up in a new session, read this file plus `.mail-check-state.json`, then you have full context; nothing else to set up.

## Automation (cloud routines)

Two scheduled cloud agents run this independently of any local session — see them at https://claude.ai/code/routines or manage via the `/schedule` skill.

**Recipe Mail Check (daily)** — id `trig_013Szw4k5ZoVweDvBbegdGyQ`, cron `0 12 * * *` (8am ET). Each run: pulls the repo, checks for reply-commands and `Cook log:` emails, checks for new scanned/attached recipes, builds pages, commits, pushes, and verifies the Pages build. Full prompt is in the routine itself (RemoteTrigger → get on that id, or the claude.ai routines page) — it's long and self-contained by design, since each run starts with zero context.

**Recipe Box Weekly Digest** — id `trig_013CKdTh9d95Pe3AA3GGPDsE`, cron `0 13 * * 0` (Sunday 9am ET). Reads `git log` for the past 7 days, emails a "what's new" summary plus the reply-command cheat sheet to both owner accounts. Read-only — never pushes.

To change either routine's behavior (e.g. adjust the schedule, tweak the prompt, swap the model), use `RemoteTrigger` with `action: "update"` and that trigger id, or ask a session to do it via the `/schedule` skill. To debug a run that misbehaved: `RemoteTrigger` → `action: "list_runs"` with the trigger id, then `action: "get_run_log"` on the run in question.

**Local high-frequency mode**: during an active scanning session (e.g. digitizing a stack of cards), a live Claude Code session can self-schedule a tighter loop (every 15 min, cheaper than the cloud's 1-hour cron minimum) using the same logic as the daily routine, via `ScheduleWakeup`. This only runs while a terminal session is open and stops on its own after 10pm or when told to stop — it's a supplement to the daily routine, not a replacement. Just ask a session to "check for new recipe emails every 15 minutes while I scan" and it'll set this up.

## State file: `.mail-check-state.json`

The single source of truth both the cloud routine and any local session read/write — always `git pull` before reading it, since another run may have updated it since you last looked.

```json
{
  "last_checked": "2026-09-08T00:50:29Z",   // ISO 8601 UTC — only look for mail newer than this
  "processed_message_ids": ["..."],          // Gmail message IDs already handled, don't reprocess
  "paused": false,                           // true = STEP "new scanned recipes" is skipped entirely
  "favorites": []                            // currently unused by the pipeline logic itself; the
}                                             // "favorite" reply-command tags the recipe's index.html
                                              // entry directly rather than tracking state here
```

## Managing the site by email (reply commands)

Reply to any Recipe Box email (or send a new one) from jim.silvia@gmail.com, mjlevy718@gmail.com, or ymlevy@yellowwood.org, with one of these as the **first line** of the body:

| Command | Effect |
|---|---|
| `favorite <recipe name>` | Adds a `favorite` tag to that recipe's index entry (fuzzy title match) |
| `remove <recipe name>` | Deletes that recipe's page, index entry, and scan/image |
| `pause` | Stops new-recipe intake (cook logs and commands still work) |
| `resume` | Turns intake back on |
| `status` | Replies by email with live recipe count, favorites, paused state, last-checked time |

Anything that doesn't match one of these exactly is just marked read and ignored — the pipeline never tries to interpret free-form intent, by design (see the `/schedule`-skill session that built this for the reasoning: a small fixed vocabulary was chosen over open natural-language commands specifically to avoid misreads on a public site).

## Known outstanding items (as of 2026-09-08)

Two scans came in incomplete and are intentionally **not** published — no content was fabricated to fill the gaps:
- **Trio of Asian Dipping Sauces** — ingredients came through, but no Directions section. Source images saved at `scans/trio-of-asian-dipping-sauces.jpg`.
- **Rigatoni with Roman Broccoli Sauce** — cuts off mid-recipe (missing the pasta amount and the rest of the method). Source image at `scans/rigatoni-with-roman-broccoli-sauce.jpg`.

A follow-up photo of either (sent the normal way — email or dropped in a chat) will get matched to the same dish and finish the page. The routine prompts already know to look for this.

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
5. Add a new `<li data-tags="..." data-added="...">` entry to `index.html`'s `.recipe-list`, matching the existing pattern (title link, tags, byline meta). The `data-tags` attribute (lowercase, hyphenated, space-separated) drives the search/filter bar on the index — reuse existing tag values where they fit (see the `<script>` block in `index.html` for how filtering works) rather than inventing near-duplicates. `data-added` is an ISO 8601 timestamp (use the current time) and drives the "Newest first" / "Oldest first" sort options — always set it on new entries.
6. Keep `assets/style.css` as the single shared stylesheet — don't fork per-recipe styles.
7. Every recipe page includes a `.timer-widget` (a plain stopwatch, shared logic in `assets/site.js`, no per-page JS needed) right after `.stat-row`, and a `.cook-log` section at the end of the article (before `</article>`) with a "Log this cook" `mailto:` button. Copy these two blocks verbatim from an existing page — see `recipes/general-tsos-tempeh.html` for a clean example — and just swap the mailto subject to `Cook log: <exact recipe title>` (URL-encoded). Include `<script src="../assets/site.js"></script>` before `</body>`.

## Cook log intake

The "Log this cook" button on every recipe page opens a pre-addressed email (`jim.silvia@gmail.com`, subject `Cook log: <recipe title>`) — this is the only way entries get added, there's no form or database since the site is static. The mail-check pipeline (daily cloud routine + local high-frequency loop) handles these on every pass, same as recipe-intake emails:

1. Search for messages TO jim.silvia@gmail.com FROM jim.silvia@gmail.com, mjlevy718@gmail.com, or ymlevy@yellowwood.org whose subject starts with `Cook log:` (case-insensitive), received after `last_checked` and not in `processed_message_ids`.
2. Match the text after the colon to the closest recipe title. If nothing matches closely enough, skip it and note why — don't guess wildly.
3. Append a new `<div class="cook-log-entry">` inside that recipe's `.cook-log-entries` (replace the `.cook-log-empty` placeholder if this is the first entry): a `.who-when` line (sender's first name + date), the email body as the comment, and an `<img>` if a photo was attached (save it under `scans/cook-logs/<slug>-<date>.jpg`, compressed the same way as recipe scans).
4. Commit and push. No notification email needed for cook-log entries — that would get noisy fast; the log itself is the record. Mark the message processed either way.

## Design notes (for consistency if extending)

- Palette: cream `#F1E8D2`, barn red `#8A3324`, spruce `#33462E`, maple `#6B4A32`, mustard `#C89A3C`, ink `#2A2420`.
- Type: Fraunces (display/headings), Karla (body).
- Ingredients render as a checklist (open squares); steps render as a numbered sequence (circled numerals) — keep that distinction since ingredients are a checklist, not a sequence.
- Recipe photos use `.recipe-photos` (a flex row of one or more `<figure>`s) — see `assets/style.css` for the rules.
- The index page (`index.html`) has a live search box and tag-filter chips built from every `<li>`'s `data-tags` attribute via a small inline `<script>` at the bottom of the file — no build step, no dependency.
