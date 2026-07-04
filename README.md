# SauceXRay

**See inside any app. Build it better.**

SauceXRay is an AI-powered mobile app analysis tool that reverse-engineers any App Store or Google Play listing into a full technical and strategic blueprint — screen flow, tech stack, monetization model, core features, and an estimated rebuild plan.

---

## Features

- **App Analysis** — Paste any App Store or Play Store URL and receive a complete breakdown instantly
- **Technical X-Ray** — Infers the real tech stack, screen architecture, and complexity score
- **Rebuild Blueprint** — AI-generated MVP scope, build order, and time estimates across VibeCoding, Hybrid, and Manual approaches
- **Creator Analysis** — Analyze YouTube, TikTok, and Instagram creators to generate monetization app ideas tailored to their audience
- **Saved Analyses** — All analyses are saved locally and searchable, filterable by difficulty or platform
- **Real Store Data** — App name, rating, developer, and price are pulled directly from official store APIs — not estimated by AI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile Framework | React Native + Expo (SDK 51) |
| Navigation | Expo Router (file-based) |
| AI Analysis | DeepSeek Chat API |
| App Store Metadata | iTunes Lookup API (official) |
| Play Store Metadata | Supabase Edge Functions (Deno) |
| Creator Data | ScrapeCreators API |
| Local Persistence | AsyncStorage |
| Serverless Backend | Supabase Edge Functions |
| Language | TypeScript |
| Build & Distribution | EAS Build (Expo Application Services) |

---

## Project Structure

```
app/                      # Screens — Expo Router file-based routing
  home.tsx                # Home with URL input and feature cards
  analyzing.tsx           # Loading animation during app analysis
  result.tsx              # Results (Overview / Technical X-Ray / Rebuild Blueprint)
  creator.tsx             # Creator analysis input (YouTube / TikTok / Instagram)
  creator-analyzing.tsx   # Creator analysis loading screen
  creator-result.tsx      # Creator profile + 3 monetization app ideas
  saved.tsx               # Saved analyses with tab toggle and search

services/
  analyzer.ts             # App analysis — DeepSeek + store metadata
  creatorAnalyzer.ts      # YouTube / TikTok / Instagram data fetching
  monetizationIdeas.ts    # AI-generated app ideas for creators
  history.ts              # App analysis local persistence
  creatorHistory.ts       # Creator analysis local persistence
  store.ts                # In-memory app result store
  creatorStore.ts         # In-memory creator result store

supabase/functions/
  play-icon/              # Play Store metadata + icon proxy (bypasses CORS)
  avatar-proxy/           # Instagram avatar proxy (bypasses CDN restrictions)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/helloahkhairul/saucexray.git
cd saucexray
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_DEEPSEEK_KEY=your_deepseek_api_key
EXPO_PUBLIC_SCRAPECREATORS_KEY=your_scrapecreators_api_key
```

### Run in Browser

```bash
npx expo start --web
```

---

## Building the APK

This project uses EAS Build for generating Android APKs.

```bash
npm install -g eas-cli
eas build --platform android --profile preview
```

---

## License

Private — all rights reserved. © helloahkhairul
