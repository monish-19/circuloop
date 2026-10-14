<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/aa59d5d9-d97c-4994-97d4-fa0b345466da

## Run Locally

**Prerequisites:** Node.js 18 or newer and npm


1. Install dependencies:
   `npm install`
2. Optional: create `.env.local` from [.env.example](.env.example) and set `GEMINI_API_KEY` if Gemini features are enabled
3. Run the development server:
   `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

Dependencies are declared in [package.json](package.json) and locked in `package-lock.json`.
The top-level [requirements.txt](requirements.txt) is a plain-text dependency reference for
environments that expect that filename; it is not a Python/pip requirements file.
