# AphasiaLens v2.0 🧠

**Bilingual (Kannada-English) WAB-based Aphasia Assessment & AI Analysis Tool**

Developed by **Mr. Hemaraja Nayaka S.**, MSc (SLP) · Dip. in HA & ET – AIISH  
Associate Professor, Dept. of Audiology & Speech-Language Pathology  
Yenepoya Medical College Hospital, Mangaluru | RCI: A30294 | ISHA: L-13072161

---

## Deploy to Netlify (5 minutes)

### Option A — Drag & Drop (No Git required)
1. Run `npm run build` — this creates a `dist/` folder
2. Go to [netlify.com](https://netlify.com) → **Add new site → Deploy manually**
3. Drag the `dist/` folder into the Netlify UI
4. Add your Anthropic API key as an environment variable (see below)

> ⚠️ **Note**: Drag & drop does NOT deploy the Netlify Functions (AI proxy). For the AI features to work, use Option B.

### Option B — Git-connected (Recommended)
1. Push this folder to GitHub or GitLab
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Select your repo — Netlify auto-detects `netlify.toml`
4. Click **Deploy site**
5. Set environment variable: **Site Settings → Environment Variables**

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | Your key from [console.anthropic.com](https://console.anthropic.com) |

The API key is stored server-side in a Netlify Function and is never sent to the browser.

---

## Local Development

```bash
npm install
cp .env.example .env.local
# add your ANTHROPIC_API_KEY to .env.local

npm install -g netlify-cli
netlify dev   # runs frontend + functions together
```

---

## Architecture

- `netlify/functions/claude-proxy.js` — Secure server-side Anthropic API proxy
- `src/AphasiaLens.jsx` — Main application (API calls routed to `/.netlify/functions/claude-proxy`)
- `netlify.toml` — Build config + SPA redirect rule
- Sarvam AI key is entered by the user at runtime (never stored)

---

## Clinical Disclaimer

For use by qualified Speech-Language Pathologists only. AI outputs are decision-support aids, not a replacement for clinical judgement. WAB classification should be verified by a licensed clinician.

Powered by Sarvam AI (STT) and Anthropic Claude (clinical AI). Freeware for clinical/educational SLP use.
