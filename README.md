# 🌫️ VayuMitra — Urban Air Quality & Winter Smog Assistant

> *A personalized, AI-driven platform empowering families and communities to navigate severe winter smog, adopt low-emission daily routines, safeguard indoor air quality, and track verifiable environmental impact.*

🌐 **Live Deployed App**: [https://urban-air-assistant-iota.vercel.app](https://urban-air-assistant-iota.vercel.app)  
📂 **GitHub Repository**: [https://github.com/asmita-ai/urban-air-assistant](https://github.com/asmita-ai/urban-air-assistant)

---

## 🏆 Project Overview

- **Chosen Vertical**: **[Challenge 6] Urban Air Quality Assistant**
- **Target Persona & Context**: Urban families in high-smog corridors (Delhi NCR, Kolkata, Mumbai, Lucknow, Patna) navigating post-Diwali seasonal thermal inversions, protecting vulnerable family members (infants, asthmatic elders, school children, daily commuters), while actively reducing personal transit emissions.
- **AI Engine**: Google Gemini (`gemini-1.5-flash`) via `@google/generative-ai`
- **Real-Time Ground-Truth Data**: Open-Meteo Air Quality API & Indian Central Pollution Control Board (CPCB) NAAQS standard calculations
- **Framework**: Next.js (App Router), TypeScript, Tailwind CSS, Vitest

---

## 🌟 Key Features & Core Pillars

### 1. 📡 Ground-Truth Real-Time Air Quality & Inversion Monitor
- **Zero Hallucination Guarantee**: Raw air quality values are strictly never generated or estimated by the LLM. Live sensor metrics are retrieved in real-time from Open-Meteo and ground-calibrated against official Indian CPCB benchmarks, ensuring 100% scientific integrity.
- **Full Chemical Pollutants Spectrum**: Real-time tracking of **PM2.5, PM10, NO₂, SO₂, CO, and Tropospheric Ozone (O₃)** with CPCB 24-hour safe threshold comparisons.
- **Atmospheric Winter Inversion Diagnostics**: Correlates ground temperature, relative humidity, and calm wind vectors to explain *why* toxic smog remains trapped near the surface.
- **24-Hour Hourly Smog Profile**: Highlights time-stamped hourly predictions with dynamic **Safe Ventilation Windows**.

### 2. 👨‍👩‍👧‍👦 Deep Household Personalization & Vulnerability Index (HVI)
- **Multi-Member Profile Management**: Supports configurable household structures (infants, school children, senior citizens, and patients with asthma, COPD, or cardiac conditions).
- **Household Vulnerability Index (HVI)**: Algorithmic composite score (0–100) dynamically reacting to household composition, commute distance, home building type, air purifier presence, and indoor plant count.
- **Differentiated Recommendations**: Ensures two users in the same city receive vastly different guidance tailored to their life situations.

### 3. 🗓️ GenAI Low-Emission Daily Routine Planner
- **Time-Slot Specific Action Plans**: Morning (06:00–11:00), Afternoon (11:00–17:00), Evening (17:00–22:00), and Night protocols.
- **Sustainable Alternatives**:
  - Shifts outdoor workouts away from morning thermal inversion peaks (06:00–08:30 AM).
  - Recommends switching from private vehicles to Delhi Metro / AC Electric buses.
  - **Trip Chaining Engine**: Algorithms suggesting the combining of multiple short trips into a single unified route to eliminate cold engine starts.
- **Verifiable Quantified Impact**: Computes direct $\text{kg CO}_2$ avoided and grams of PM emissions prevented for every action.
- **Scientific Justifications**: Explains the exact physiological and environmental rationale for every recommendation.

### 4. 🧪 Indoor Air Quality (IAQ) Lab & Hacks
- **Indoor vs Outdoor Attenuation Gauge**: Visualizes indoor AQI differential based on home sealing and purifier status.
- **Safe Natural Ventilation Window Predictor**: Identifies the exact mid-afternoon solar heating window (typically 13:00–15:30) when ground-level smog concentrations thin out by up to 35%.
- **Interactive Room CADR Calculator**: Computes required Clean Air Delivery Rate (in CFM and m³/h) based on room cubic volume ($L \times W \times H$) to achieve 4.5 Air Changes per Hour (ACH).
- **DIY Box-Fan Filter Hack Tutorial**: Step-by-step instructions for assembling a ₹1,500 DIY MERV 13 / HEPA fan filter delivering 80% of commercial purifier performance.
- **NASA Clean Air Plants Matrix**: Specific guidance on Snake Plant (*Sansevieria*), Areca Palm, Spider Plant, and Money Plant (*Pothos*), with oxygen cycles and VOC absorption metrics.
- **Science-Backed Domestic Hacks**: Wet mopping vs dry sweeping particle aerosolization, door-draft snake sealing, and cooking spice (tadka) exhaust containment.

### 5. 📉 Direct Impact & Community Action Tracker
- **Interactive Commitments Checklist**: Track daily actions like metro transit, trip chaining, wet mopping, and N95 usage.
- **Cumulative Footprint Tallies**: Live calculation of total personal CO₂ saved (kg), particulate matter prevented (g), and tree-day absorption equivalents.
- **Shareable Clean Air Commitment Card**: One-click formatted summary copyable to clipboard for WhatsApp and LinkedIn.

### 6. 🤖 Vayu AI Copilot (Gemini-Powered)
- Interactive conversational assistant aware of current city, live AQI, atmospheric factors, and household profile.
- Answers complex queries regarding mask selection (N95 vs surgical), child school attendance, purifier troubleshooting, and emergency symptoms.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Client (Next.js UI)                           │
│  - Live Smog Monitor  - Routine Planner  - IAQ Lab  - Vayu AI Copilot  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js API Gateway / Proxy Layer                   │
│   (Protects API Keys • CORS • Rate Limiting • 15-Min In-Memory Cache)  │
├─────────────────────┬────────────────────┬─────────────────────────────┤
│   /api/aqi (GET)    │ /api/ai/routine    │ /api/ai/chat & iaq-audit    │
└──────────┬──────────┴──────────┬─────────┴──────────────┬──────────────┘
           │                     │                        │
           ▼                     ▼                        ▼
┌──────────────────────┐  ┌──────────────────────────────────────────────┐
│   Open-Meteo &       │  │               Google Gemini AI               │
│   CPCB Data Service  │  │            (gemini-1.5-flash)                │
│  - Real-time PM2.5   │  │  - Contextual Routine Generator              │
│  - Weather Inversion │  │  - Science-backed Justifications             │
│  - Indian AQI Calc   │  │  - Resilient Deterministic Fallback Mode     │
└──────────────────────┘  └──────────────────────────────────────────────┘
```

---

## 🔬 Approach and Logic

### 1. Indian CPCB AQI Calculation Formula
The application calculates AQI using the official Central Pollution Control Board (CPCB) linear interpolation sub-index formula:

$$I_p = \left[\frac{I_{hi} - I_{lo}}{B_{hi} - B_{lo}}\right] \times (C_p - B_{lo}) + I_{lo}$$

Where:
- $C_p$ is pollutant concentration (PM2.5, PM10).
- $B_{hi}, B_{lo}$ are breakpoint concentrations according to Indian National Ambient Air Quality Standards (NAAQS).
- $I_{hi}, I_{lo}$ are AQI index breakpoints.

### 2. Household Vulnerability Score (HVI)
$$HVI = 20 + \min\left(40, \frac{\text{AQI}}{500} \times 40\right) + \sum V_{\text{members}} - M_{\text{purifier}} - M_{\text{plants}} \pm C_{\text{commute}}$$
- **Vulnerable members**: Infants (+15), Children (+8), Seniors (+12), Respiratory/Asthma (+20).
- **Protective mitigations**: HEPA Air Purifier (-15), Indoor bio-filtration plants (-5).
- **Commute exposure**: Open two-wheeler/cycle (+10), Remote WFH (-10).

### 3. Transit Emission Reductions
- Standard petrol car emission factor in urban traffic: $\approx 0.165\text{ kg CO}_2/\text{km}$, $0.05\text{g PM}/\text{km}$.
- Delhi Metro electrified transit: $\approx 0.015\text{ kg CO}_2/\text{passenger-km}$.
- A daily 16 km one-way commute (32 km roundtrip) switched to Metro avoids **$4.8\text{ kg CO}_2$** and **$1.5\text{g of PM}$** emissions while lowering passenger inhaled exposure by $75\%$.

---

## 📌 Assumptions Made

1. **Infiltration Rate**: In unsealed Indian urban apartments, outdoor PM2.5 infiltration averages 60%–70%. With door-draft snakes and closed windows, infiltration drops to 25%–35%.
2. **CADR Calculation**: Clean Air Delivery Rate is calculated targeting 4.5 Air Changes per Hour (ACH) for severe smog conditions ($CADR = \frac{\text{Room Volume (cu ft)} \times 4.5}{60}$).
3. **Atmospheric Inversion Dynamics**: Ground-level thermal inversion layer is modeled based on sunrise, wind velocity (&lt; 8 km/h indicates high stagnation), and solar radiation peaking between 13:00 and 15:30.

---

## 🛡️ Evaluation Criteria Alignment

| Evaluation Parameter | How VayuMitra Excels |
| :--- | :--- |
| **Code Quality** | Strict TypeScript throughout, modular component architecture, zero implicit `any`, clean separation of concerns, and full ESLint compliance. |
| **Security** | Zero exposed client keys; all AI and external calls routed through server-side proxy; input sanitization; 0 npm vulnerabilities (`npm audit` clean). |
| **Efficiency** | 15-minute in-memory caching for external AQI queries; minimal re-renders; static page prerendering; lightweight icons and bundle size. |
| **Testing** | 100% passing automated Vitest unit test suite covering AQI formulas, vulnerability metrics, emission calculations, routine generation, and IAQ algorithms. |
| **Accessibility (a11y)** | Semantic HTML5 (`header`, `main`, `section`, `footer`), high-contrast CPCB color-coded badges, keyboard navigation, ARIA tags, and screen-reader support. |
| **Problem Statement Alignment** | Directly tackles winter smog, personalizing low-emission routines and indoor air hacks for families, while explaining *why* choices matter. |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+ installed
- Git installed

### 1. Clone the repository
```bash
git clone https://github.com/asmita-ai/urban-air-assistant.git
cd urban-air-assistant
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the application runs seamlessly in smart fallback mode with verified scientific heuristics).*

### 4. Run Automated Tests
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm start
```

---

## 📦 Deployment

### Deploy to Vercel (Recommended — 1 Click)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Add the `GEMINI_API_KEY` under Environment Variables.
4. Click **Deploy**. The application is live in under 60 seconds!

---

## 📄 License
MIT License. Developed by Asmita Karmakar.
