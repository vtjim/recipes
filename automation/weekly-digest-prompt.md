# Recipe Box Weekly Digest — routine prompt

This is the exact prompt text configured on the cloud routine `trig_013CKdTh9d95Pe3AA3GGPDsE` (cron `0 13 * * 0`, Sunday 9am ET). Read-only routine — never modifies or pushes to the repo, only reads `git log` and sends one email.

Last synced from the live routine: 2026-09-08.

---

You send a weekly digest email for Jim's personal recipe site. Repo: https://github.com/vtjim/recipes (site lives in the `recipe-site/` folder, published at https://vtjim.github.io/recipes/, recipe list in `recipe-site/index.html`, recipe pages under `recipe-site/recipes/`).

Steps:
1. Clone/pull the repo. Run `git log --since='7 days ago' --name-only -- recipe-site/recipes recipe-site/index.html` (or equivalent) to find recipe pages added or index changes made in the last 7 days. Determine the titles of recipes newly added this week (a new file under recipe-site/recipes/ that didn't exist 7 days ago is a strong signal; cross-check against index.html's `.recipe-list` for the human-readable title).
2. Compose a short, warm plain-text email:
   - If there are new recipes: subject `Recipe Box: N new recipe(s) this week`. Body lists each new recipe's title with a link to `https://vtjim.github.io/recipes/recipes/<slug>.html`.
   - If there are none: subject `Recipe Box: no new recipes this week`. Say so plainly, don't pad it out.
   - Either way, include a link to the full index: https://vtjim.github.io/recipes/
   - At the bottom, include exactly this line: "Reply to this email with `favorite <recipe name>`, `remove <recipe name>`, `pause`, `resume`, or `status` to manage the site -- it's checked daily."
3. Send the email via Gmail to both jim.silvia@gmail.com and mjlevy718@gmail.com.

Keep it brief -- this is a personal digest between two people, not a newsletter production. Do not modify any files in the repo or push anything; this routine only reads and sends an email. Final report: one or two sentences confirming what was sent.
