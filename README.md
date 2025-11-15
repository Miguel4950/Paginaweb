<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally or as a plain browser experience.

View your app in AI Studio: https://ai.studio/apps/drive/1FcD8Bm2E_dhBPmonBbVEtwITTNPbgeB2

## Quick start (open directly in the browser)

1. Edit [`config.js`](config.js) and replace `PASTE_YOUR_GEMINI_API_KEY_HERE` with your Gemini API key (or set `window.GEMINI_API_KEY` before loading the page if you prefer to inject it dynamically).
2. Double-click `index.html` (or open it from Chrome/Safari/Firefox). All dependencies are loaded through the `<script type="module">` tag and the included import map, so no build tooling is required.

> **Note:** Your API key lives entirely in your browser with this workflow. Do not deploy with a production key unless you understand the security implications.

## Optional: run with Vite

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Update [`config.js`](config.js) with your Gemini key (same as above).
3. Start the dev server: `npm run dev`
