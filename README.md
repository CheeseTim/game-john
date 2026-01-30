# Acronym Fill — CompTIA A+ Practice Game

A small HTML/CSS/JS game to practice acronyms from CompTIA A+ (1201) objectives.

## What this project contains

- `index.html` — the game UI (dark theme)
- `styles.css` — dark theme styles
- `script.js` — game logic
- `data/acronyms.json` — JSON list of acronyms and expansions (edit to add/remove items)

---

## How it works

Each round the app displays an acronym and its expansion with one word replaced by a blank. Type the missing word and press **Check**. Score is kept in localStorage.

## How to run locally

1. Open `index.html` in a browser. For a better local dev experience, run a simple static server in the project folder:

- Python 3: `python -m http.server 8000`
- Node: install `serve` (`npm i -g serve`) then `serve .`

2. Open http://localhost:8000 in your browser.

## Deploying to Netlify ✅

1. Commit and push this repository to GitHub.
2. In Netlify, click **New site** → **Import from Git**.
3. Select your GitHub repository and follow the prompts. No build command is required for this static site—the default publish directory is the project root.
4. Netlify will auto-deploy when you push new commits.

> Tip: If you prefer, create a new GitHub repository for the project and push these files there. Netlify can import any public Git repo.

## Edit the acronym list

Open `data/acronyms.json` and add or edit entries in the format:

```json
{ "acronym":"CPU", "expansion":"Central Processing Unit" }
```

### Brainrot mode (fun)

Toggle the **Brainrot Mode** button in the header to play with silly phrases instead of CompTIA acronyms. Edit `data/brainrot.json` to add your own fun phrases (same object format: `acronym` and `expansion`).

When Brainrot Mode is active the app switches to a playful visual theme (accent colors, background, and a fun font).
---

## License

MIT

---

If you'd like, I can push these files to GitHub for you and create a deploy-ready repository and give step-by-step Netlify import instructions tailored to the repository.
