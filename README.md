# Codeforces Tag Hider

A tiny Chrome extension that adds an on-page toggle to hide or show problem tags on Codeforces problem pages. The toggle is injected directly above the "Problem tags" caption so it is easy to access while reading a problem.

## Features

- Toggle placed immediately above the "Problem tags" caption.
- Tags are hidden by default on first run (configurable).
- Smooth opacity transition (fade) for a nicer visual effect when hiding/showing tags.
- Preference stored in `chrome.storage.sync` with `localStorage` fallback.

## Quick install (developer mode)

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select the `cf-tag-hider/` folder.
4. Visit a Codeforces problem page (for example: `https://codeforces.com/problemset/problem/1873/A`) and look for the "Hide tags" checkbox above the tags.ions.

## Contributing

PRs welcome.

## Author

Made by Priyanshu Raj.

