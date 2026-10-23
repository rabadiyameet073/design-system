<div align="center">
  <h1>🎨 Design System Studio</h1>
  <p><strong>Founder-First Website Design System & Developer Tokens Studio</strong></p>
</div>

A full-stack web application for crafting complete, production-ready design systems, typography scales, accessible color palettes, UI components, code generators, and multi-format design specifications (PDF, JSON, CSS, Tailwind).

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or Node 20+
- npm, yarn, or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your credentials:
```env
# Optional Gemini AI API Key
GEMINI_API_KEY="your_gemini_api_key"

# App URL (defaults to localhost:3000 locally)
APP_URL="http://localhost:3000"

# Google OAuth 2.0 Credentials (Identity only: profile & email)
OAUTH_CLIENT_ID="your_google_client_id"
OAUTH_CLIENT_SECRET="your_google_client_secret"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Deploy to Vercel

This repository is pre-configured for seamless zero-config deployment on [Vercel](https://vercel.com).

### Automatic Deployment (GitHub Integration)
1. Push this repository to GitHub: `https://github.com/rabadiyameet073/design-system`
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the `design-system` repository.
4. Framework Preset: **Vite** (automatically detected).
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add Environment Variables in the Vercel project settings:
   - `OAUTH_CLIENT_ID`: Your Google OAuth Client ID
   - `OAUTH_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `APP_URL`: Your Vercel domain (e.g. `https://your-project.vercel.app`)
   - `GEMINI_API_KEY`: (Optional) Your Gemini API Key
8. Click **Deploy**!

### Architecture on Vercel
- **Frontend**: Vite Single Page Application served globally at edge via Vercel CDN (`dist/`).
- **Serverless API**: Handled automatically by `/api/index.ts` serverless function for `/api/*` and `/auth/callback` endpoints.
- **Routing**: Managed cleanly through `vercel.json` rewrites.

---

## 🛠️ Scripts

- `npm run dev`: Starts Express full-stack engine with Vite development middleware.
- `npm run build`: Compiles production frontend bundle with Vite.
- `npm run lint`: Performs TypeScript type check (`tsc --noEmit`).
- `npm run preview`: Previews built production assets locally.

---

## 🔒 Google OAuth 2.0 Notes
- Authentication strictly requests identity verification scopes (`openid`, `profile`, `email`).
- When deploying to Vercel, add your Vercel URL to the Authorized JavaScript Origins and Authorized Redirect URIs in the Google Cloud Console:
  - Authorized Origin: `https://your-project.vercel.app`
  - Authorized Redirect URI: `https://your-project.vercel.app/auth/callback`
