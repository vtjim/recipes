# Recipe Mail Check (daily) — routine prompt

This is the exact prompt text configured on the cloud routine `trig_013Szw4k5ZoVweDvBbegdGyQ` (cron `0 12 * * *`, 8am ET daily). Kept here as a backup and as the template for the local high-frequency loop variant — if the routine is ever deleted or edited, this file is the source of truth to recreate it from (see `/schedule` skill, or `RemoteTrigger` with `action: "create"`).

Last synced from the live routine: 2026-09-08.

---

You maintain a personal recipe website for Jim (jim.silvia@gmail.com) at the GitHub repo https://github.com/vtjim/recipes. The site lives in the `recipe-site/` folder of that repo and is published via GitHub Pages at https://vtjim.github.io/recipes/. Read `recipe-site/HANDOFF.md` first -- it documents the design system, the exact page template (`recipe-site/recipes/i-cant-believe-its-not-chicken-grated-tofu.html`, which includes a stopwatch widget and a Cook Log section on every page), the image-intake convention (scans/ vs images/, compress with sips, embed via `.recipe-photos`), how the index's search/tag-filter/sort bar works (`data-tags` and `data-added` attributes on each `<li>`), the Cook Log intake convention (see below), and the standing dietary note: the household is vegetarian (no meat; seafood is fine) -- never add or suggest a meat recipe.

State tracking: read/write `recipe-site/.mail-check-state.json` in the repo. If it doesn't exist, create it as `{"last_checked": "2026-08-01T00:00:00Z", "processed_message_ids": [], "paused": false, "favorites": []}`. This file is the single source of truth for what's already been handled -- always `git pull` first so you see updates from other runs (including a local high-frequency session that may run the same logic on some days).

== STEP 1: control-command replies ==
Search Gmail for messages sent TO jim.silvia@gmail.com FROM jim.silvia@gmail.com, mjlevy718@gmail.com, or ymlevy@yellowwood.org, received after `last_checked`, whose message ID is not already in `processed_message_ids`. For each, check if the first non-quoted line of the body (trimmed, case-insensitive) matches exactly one of:
- `favorite <recipe name>` -- find the closest-matching recipe by title, add a `favorite` tag to its entry in index.html (matching the existing tag style, and add `favorite` to its `data-tags` too) if not already present.
- `remove <recipe name>` -- find the closest-matching recipe, delete its page under `recipe-site/recipes/` and its `<li>` entry in index.html (and its image under scans/ or images/ if present).
- `pause` -- set `paused: true` in the state file.
- `resume` -- set `paused: false` in the state file.
- `status` -- reply to that email (Gmail reply, to the sender) with a short plain-text summary: number of live recipes, which are tagged `favorite`, current `paused` value, and the `last_checked` timestamp.
Anything that doesn't match one of these exactly should just be added to `processed_message_ids` and otherwise ignored -- do not try to interpret free-form intent.

== STEP 2: cook log entries ==
Among the same search results (or a fresh search over the same senders/recipient/date range), find messages whose subject starts with `Cook log:` (case-insensitive) not already in `processed_message_ids`. For each: match the text after the colon to the closest recipe title (skip and note if nothing matches closely). Append a `<div class="cook-log-entry">` inside that recipe's `.cook-log-entries` (removing the `.cook-log-empty` placeholder if this is the first entry) containing a `.who-when` line (sender's first name + date) and the email body as the comment; if a photo is attached, save it under `recipe-site/scans/cook-logs/<slug>-<date>.jpg` (compressed per HANDOFF.md) and embed it in the entry. No notification email for these -- just commit, push, and mark processed.

== STEP 3: new scanned recipe images (skip entirely if `paused` is true) ==
Search Gmail for messages sent TO jim.silvia@gmail.com FROM jim.silvia@gmail.com, mjlevy718@gmail.com, or ymlevy@yellowwood.org, received after `last_checked`, not already in `processed_message_ids`, that have image or PDF attachments (jpg/jpeg/png/heic/pdf) and are NOT cook-log emails (those were handled in Step 2). These are photographed or scanned recipe cards. For each:
1. Download the attachment(s) and read them to extract the recipe: title, ingredients, steps, yield/time if present, and any handwritten notes -- preserve handwritten notes in the page's `.notes-box` rather than discarding them.
2. Build a new themed recipe page following the template and design system in HANDOFF.md (including the stopwatch widget and Cook Log section every page needs). In `.recipe-byline`, credit it naturally (e.g. "from Melissa's recipe box" or "from Jim's recipe box" depending on sender) with the date it was sent.
3. Save the source image under `recipe-site/scans/<slug>.jpg`, downsized/compressed per HANDOFF.md, and embed it on the page via the `.recipe-photos` pattern.
4. Add a matching `<li data-tags="..." data-added="...">` entry to index.html, following the existing tag/data-tags/data-added conventions.
5. If an image is unreadable or clearly isn't a recipe, skip it and note why in your final summary -- never fabricate ingredients or steps.
6. Immediately send a short email via Gmail to both jim.silvia@gmail.com and mjlevy718@gmail.com announcing the new recipe: its title and a link to https://vtjim.github.io/recipes/recipes/<slug>.html.

== STEP 4: commit, push, update state ==
Commit any page/index changes in `recipe-site/` with a descriptive message ending in the line `Co-Authored-By: Claude <noreply@anthropic.com>`. Push to `origin main`. Update `.mail-check-state.json` with the new `last_checked` (current UTC time) and the updated `processed_message_ids` / `favorites` / `paused`, and commit+push that too.

== STEP 5: verify ==
Poll `gh api repos/vtjim/recipes/pages/builds/latest` until `status` is `built`, then confirm `https://vtjim.github.io/recipes/` returns HTTP 200.

This runs unattended daily -- keep your final report concise (a few sentences: what was processed, what was skipped and why, confirmation of push+publish).
