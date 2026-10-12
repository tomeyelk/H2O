# H2O · Spend smart, live better

Your own money app: it installs on your phone with the H2O logo, opens without Claude, works offline, and keeps your phone and computer in sync. Your data lives in your own Netlify account and is protected by your H2O code.

## What's in the folder

| File | What it does |
|---|---|
| `index.html` | The app itself |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | Make it installable with your logo |
| `sw.js` | Lets it open without internet |
| `functions/sync.mjs` | Saves your data in Netlify |
| `functions/ask.mjs` | The "Ask H2O" assistant (optional) |
| `netlify.toml`, `package.json` | Settings for Netlify |

## 1. Put the files on GitHub

1. On github.com, click **New** to create a repository named `h2o` (Private is fine).
2. Click **uploading an existing file**.
3. Unzip `H2O.zip`, open the `h2o` folder, select **everything inside it** (including the `functions` folder) and drag it in.
4. Click **Commit changes**.

Check: the repository must show `index.html` and `netlify.toml` at the top, and a `functions` folder containing `sync.mjs` and `ask.mjs`. If `sync.mjs` and `ask.mjs` landed at the top instead, use **Add file → Create new file**, type `functions/sync.mjs` as the name, and paste its content (same for `ask.mjs`).

## 2. Connect it to Netlify

1. On app.netlify.com (Pierre's account), click **Add new project → Import an existing project → GitHub**, and pick `h2o`.
2. Leave the build settings as they are and click **Deploy**.
3. Go to **Project configuration → Environment variables → Add a variable**:
   - `H2O_CODE` = a long secret only you know, for example `blue-coin-splash-2026`.
4. Go to **Deploys → Trigger deploy → Deploy project** so the code takes effect.
5. Optional: under **Domain management**, rename the site, for example `h2o-tomey.netlify.app`.

## 3. Install it on your phone

1. Open `https://YOUR-SITE.netlify.app/#h2o-YOUR-CODE` on your phone. It opens straight in.
2. **iPhone:** in Safari, tap Share, then **Add to Home Screen**.
   **Android:** in Chrome, tap ⋮, then **Install app**.

The coin-and-splash logo appears on your home screen. Do the same on your computer if you want.

## 4. Turn on "Ask H2O" (optional)

The assistant needs a Claude API key. This is billed separately from your Claude subscription: you pay a small amount per question.

1. Go to console.anthropic.com, create an account, add credit, and set a monthly spending limit under **Limits**.
2. Create an API key under **API keys**.
3. On Netlify, add the variable `ANTHROPIC_API_KEY` with that key, then **Trigger deploy** again.

Without a key, everything else works and the "Ask H2O" card simply stays hidden.

## Good to know

- Offline, H2O keeps working and syncs once you're back online. The dot next to "Synced" turns orange while saving and red when offline.
- To lock the app on a device: **Plan & settings → Lock H2O on this device**.
- To change your code: change `H2O_CODE` on Netlify and trigger a deploy. Each device will ask for the new code.
- Entries made in the Claude version of H2O don't move over automatically. This one starts fresh.
