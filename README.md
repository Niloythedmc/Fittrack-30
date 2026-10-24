# FitTrack 30 — Telegram Mini App

A responsive React + Vite fitness tracker personalized for a 30-day chest-building and body-recomposition plan. Includes meal/protein checklists, 330 ml Nova bottle hydration counter, weekly workouts with exercise image references, measurement history, and a Telegram Web App integration.

## Features

- Bottom navigation: Today, Meals, Water, Workout, Progress
- Four meals with quantities and estimated protein
- Individual food completion checklist
- Water counter in 330 ml bottle increments
- Seven-day workout split and individual exercise checkmarks
- Weight and waist measurement history
- Saves data in the browser's localStorage on the current device/browser
- Telegram Mini App SDK support (`ready`, `expand`, header/background colors)
- Responsive layout with mobile safe-area support

## Run locally

Install Node.js 20 or newer, then:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To test the production build:

```bash
npm run build
npm run preview
```

## Deploy to GitHub + Vercel

1. Extract this project folder.
2. Create a new GitHub repository.
3. Upload the project files and commit them.
4. In Vercel, choose **Add New → Project**, import the GitHub repository.
5. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
6. Deploy. Vercel will give you an HTTPS URL.

No environment variables or database are required for the basic version.

## Add it to Telegram

1. Open Telegram and talk to **@BotFather**.
2. Create a bot with `/newbot`, or use an existing bot.
3. Use BotFather's Mini App / Web App settings to set the deployed HTTPS URL as the app URL. BotFather menu names can change; look for the web app or main app configuration for your bot.
4. Configure a menu button or Main Mini App launch entry that points to your Vercel URL.
5. Open the bot and launch the app from Telegram.

The page includes Telegram's official Web App JavaScript SDK. When opened in Telegram it calls `Telegram.WebApp.ready()` and `expand()`.

## Important notes

- This version stores checkmarks and measurements in `localStorage`. They stay in that browser on that device, but they do **not** sync across devices and can be cleared if browser data is erased.
- Telegram user data is not sent to a server. Do not trust `initDataUnsafe` for authentication if you later add a backend; validate Telegram `initData` server-side.
- Exercise and food images load from Unsplash image URLs and require internet access. They are visual references, not medical or coaching supervision.
- Water needs vary by weather, activity, sweat, and medical conditions. Seven 330 ml bottles is a flexible starting target, not a universal medical prescription.
- Protein and calories are estimates. Use your food packaging and cooked weights to calculate more precisely.
- The project does not include a backend, accounts, push notifications, or cloud sync. Those can be added later if needed.

## Tech stack

- React 18
- Vite 6
- Lucide icons
- Telegram Web App SDK
- Browser localStorage
