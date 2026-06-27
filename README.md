<div align="center">

# ⚡ KickBracket Pro ⚡

**The Ultimate Broadcast-Grade Tournament Management Platform**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  A state-of-the-art web application designed to create, manage, and broadcast dynamic sports and gaming tournaments with real-time cloud synchronization, animated brackets, and automated standings calculations.
</p>

[View Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features That Wow

### 🏆 Universal Tournament Formats
KickBracket Pro includes an advanced scheduling algorithm that generates flawless match fixtures across 6 distinct competition structures:
- **Round Robin** & **Double Round Robin** (League standings with automated points tables)
- **Single Elimination** & **Double Elimination** (Visual knockout brackets)
- **Swiss System** & **Group + Knockout Stages**

### 🌐 Zero-Config Real-Time Cloud Sync
Share live links with participants and spectators across the globe instantly—no login or database setup required!
- **Auto-Updating Spectator View:** Viewers receive real-time score updates every 3 seconds without refreshing the page.
- **Serverless Cloud Proxy:** Powered by custom backend proxy routes (`/api/sync`) ensuring lightning-fast cross-origin updates.

### 🎨 Broadcast-Grade UI/UX
Designed to deliver a stunning first impression and premium user engagement:
- **Sleek Dark Mode & Glassmorphism:** Harmonious HSL color palettes and translucent backdrop blurs.
- **Micro-Animations:** Fluid transitions powered by **Framer Motion** for live status indicators, score modals, and match cards.
- **Champion Celebration:** Interactive confetti explosions (`canvas-confetti`) and victory toasts when a winner is crowned.

### ✏️ Self-Correcting Interactive Brackets
Organizing sports events is dynamic. KickBracket Pro handles edits seamlessly:
- **Universal Score Editing:** Click directly on any completed score tag or bracket card to modify past scores.
- **Dynamic Knockout Advancement:** Changing a winner in an early knockout round automatically traces and corrects future bracket fixtures downstream.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **[Next.js 16](https://nextjs.org/)** | Core framework utilizing App Router and Serverless API Routes |
| **[TypeScript](https://www.typescriptlang.org/)** | Type-safe architecture across models, brackets, and standing calculations |
| **[Framer Motion](https://www.framer.com/motion/)** | Smooth UI micro-animations, layouts, and gesture interactions |
| **[Vanilla CSS / Tokens](https://developer.mozilla.org/en-US/docs/Web/CSS)** | Highly custom design system with glowing borders and glass effects |
| **[Prisma / LocalStorage](https://www.prisma.io/)** | Hybrid state persistence supporting rapid offline management and cloud sync |

---

## 🚀 Quick Start Guide

To run KickBracket Pro locally on your machine, follow these simple steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sainath-16/kickbracket-pro.git
   cd kickbracket-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to start creating professional tournaments!

---

## 📂 Project Structure

```text
kickbracket-pro/
├── app/
│   ├── api/sync/          # Serverless real-time cloud sync proxy endpoint
│   ├── components/        # Reusable UI elements, animated icons, and modals
│   ├── dashboard/         # Organizer management dashboard & tournament creation
│   ├── shared/            # Read-only real-time auto-updating spectator view
│   ├── tournament/[id]/   # Live interactive fixture tables, brackets, and standings
│   ├── globals.css        # Design tokens, custom animations, and utilities
│   └── page.tsx           # Animated landing page & features showcase
├── lib/                   # Database client & helper configurations
└── prisma/                # Database schema definitions
```

---

## 📈 Roadmap & Future Enhancements
- [x] Multi-format scheduling engine (Round Robin, Knockout, Swiss)
- [x] Base64 offline snapshot URL sharing
- [x] Zero-config live cloud synchronization API
- [x] Interactive score editing and self-correcting bracket paths
- [ ] Export standings and brackets to high-resolution PNG / PDF
- [ ] Custom team logo uploads and color customization

---

## 📄 License
Distributed under the MIT License. Feel free to use, modify, and build upon this platform for your sports clubs, gaming leagues, and community events!

<div align="center">
  <p>Built with ❤️ for sports enthusiasts and competitive gamers.</p>
</div>
