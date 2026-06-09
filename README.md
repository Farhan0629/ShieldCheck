# ShieldCheck — Cybersecurity Education Platform

A browser-based cybersecurity education platform that demonstrates password security concepts through interactive analysis, breach checking via k-anonymity, attack simulation, and privacy education — all running **entirely client-side**.

Built by **Farhan Naser**

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Features & How They Work](#features--how-they-work)
  - [Password Strength Analysis](#1-password-strength-analysis)
  - [Breach Check (k-Anonymity)](#2-breach-check-k-anonymity)
  - [Time-to-Crack Estimator](#3-time-to-crack-estimator)
  - [Pattern Detection](#4-pattern-detection)
  - [Passphrase Enhancer](#5-passphrase-enhancer)
  - [Attack Simulator](#6-attack-simulator)
  - [Privacy Inspector](#7-privacy-inspector)
- [Technologies Used](#technologies-used)
- [Setup & Launch](#setup--launch)
- [Security & Privacy](#security--privacy)

---

## Architecture Overview

ShieldCheck is a **zero-backend, single-page application** (SPA). All computation happens in the browser. The only external request is a privacy-preserving API call to Have I Been Pwned (HIBP) for breach data, and even that never reveals the full password.

```
┌──────────────────────────────────────────────────────────┐
│                     index.html                           │
│  (HTML structure, CDN links, Tailwind config)            │
└──────────┬──────────────────────────────┬────────────────┘
           │ <link>                       │ <script defer>
           ▼                              ▼
┌───────────────────┐         ┌─────────────────────────────┐
│   styles.css      │         │        app.js               │
│  (Custom CSS      │         │  (All application logic)    │
│   animations,     │         │                              │
│   transitions)    │         │  ┌───────────────────────┐   │
└───────────────────┘         │  │ zxcvbn (CDN)          │   │
                              │  │ Password strength      │   │
┌───────────────────┐         │  │ estimation             │   │
│  Tailwind CSS CDN  │         │  └───────────────────────┘   │
│  (Utility-first    │         │                              │
│   framework)       │         │  ┌───────────────────────┐   │
└───────────────────┘         │  │ HIBP API               │   │
                              │  │ k-anonymity breach     │   │
┌───────────────────┐         │  │ check                  │   │
│  Web Crypto API   │         │  └───────────────────────┘   │
│  (SHA-1 hashing)  │         │                              │
│  Built into       │         │  ┌───────────────────────┐   │
│  all browsers     │         │  │ Web Crypto API        │   │
└───────────────────┘         │  │ (SHA-1 digest)        │   │
                              │  └───────────────────────┘   │
                              └─────────────────────────────┘
```

---

## Project Structure

```
ShieldCheck/
├── index.html        # HTML structure, CDN links, Tailwind config
├── styles.css        # Custom CSS animations, transitions, effects
├── app.js            # All application logic (~1250 lines)
├── README.md         # This file
└── .git/             # Git repository
```

### `index.html`
- Semantic HTML5 structure
- CDN script tags for Tailwind CSS, zxcvbn, and Google Fonts
- Inline `<script>` block for Tailwind configuration (colors, fonts, dark mode)
- Links to `styles.css` and `app.js` (with `defer` for proper load ordering)
- All UI sections: Navigation, Hero, Dashboard, How It Works, About, Footer, Modals

### `styles.css`
- 165 lines of custom CSS (not provided by Tailwind)
- Custom scrollbar styling
- Card hover effects with transforms and box-shadows
- Button glow effects
- Custom keyframe animations: pulse-alert, scan, step-glow, matrix-fall, blink, fadeInUp, float, stripes, shimmer
- Modal backdrop with backdrop-filter blur
- Step/flow line animations for the k-anonymity visualizer
- All prefixed with semantic class names (`.card-hover`, `.btn-glow`, `.section-card`, etc.)

### `app.js`
- ~1250 lines of vanilla JavaScript (no framework dependencies)
- Self-contained with no imports (relies on global `zxcvbn` from CDN)
- Organized into clear sections:
  1. Word list and configuration data
  2. DOM element references
  3. Utility functions (SHA-1, formatting, sleep)
  4. Pattern detection (l33t, keyboard, year)
  5. Crack time calculation
  6. Strength meter updates
  7. Passphrase generation/enhancement
  8. Attack simulation (dictionary, pattern, brute-force)
  9. Privacy inspector
  10. Breach check with k-anonymity flow animation
  11. Event listeners

---

## Features & How They Work

### 1. Password Strength Analysis

Uses **zxcvbn** (Dropbox's password strength estimator) to analyze passwords in real-time.

**Input:** Any text in the password field.  
**Output:** Score (0–4), crack time estimate, pattern detection, and suggestions.

**zxcvbn** evaluates:
- Dictionary words (in multiple languages)
- Common passwords and patterns
- Keyboard walks (qwerty, asdf, etc.)
- Dates, years, and repeats
- L33t substitutions
- Statistical entropy estimation

The strength bar uses a 5-tier color-coded system: Red (Very Weak) → Orange (Weak) → Yellow (Fair) → Lime (Strong) → Green (Very Strong).

### 2. Breach Check (k-Anonymity)

Communicates with the **Have I Been Pwned** API using the **k-anonymity** protocol — your full password never leaves the browser.

**The 4-Step Process:**

```
Password: "MySecret123!"
        │
        ▼
Step 1: SHA-1 hash (browser, via Web Crypto API)
        │
        ▼
Hash: "2DB8F12E9A7F3C4E1B9D6A8F2E1C3D4B5E6F7A8B9"
        │
        ▼
Step 2: Split hash into prefix (5 chars) + suffix (35 chars)
        │
        ▼
Send: "2DB8F1"    Keep: "2E9A7F3C4E1B..."
        │
        ▼
Step 3: GET https://api.pwnedpasswords.com/range/2DB8F1
        │
        ▼
Step 4: API returns ~500 matching hash suffixes
        Browser compares locally → match or no match
```

**Why this is secure:** The API only sees 5 characters of the hash (20 bits of entropy). With ~500 results returned, it cannot determine which one is your password. Your full hash never leaves your device.

### 3. Time-to-Crack Estimator

Calculates how long it would take to crack the password on three hardware tiers:

| Hardware | Hash Rate | Description |
|----------|-----------|-------------|
| Laptop (CPU) | 10,000 H/s | Single-threaded CPU attack |
| RTX 4090 (GPU) | 200,000 H/s | Consumer GPU |
| Botnet/Cloud | 100B H/s | Distributed attack |

The calculation uses zxcvbn's `guesses` metric divided by each hardware's hash rate. The time display auto-scales from seconds to "Trillion years".

### 4. Pattern Detection

Three detectors run on every password input:

- **L33t Speak Detector** — Matches `[0-3@$]` patterns and decodes substitutions like `p@ssw0rd` → `password`
- **Keyboard Pattern Detector** — Checks for common walks like `qwerty`, `asdfgh`, `1qaz2wsx`, `zxcvbnm`
- **Common Year Detector** — Matches years 1970–2029 using regex `(19[7-9]\d|20[0-2]\d)`

Each detected pattern shows a specific warning card with explanation.

### 5. Passphrase Enhancer

Two modes:

- **No password entered:** Generates a 4-word passphrase from a 130-word list (~27.7 bits entropy), joined by hyphens (e.g., `crane-jazz-lunar-vortex`)
- **Password exists:** Enhances the existing password by capitalizing the first letter, appending a random digit + symbol, and adding a word suffix (e.g., `hello` → `Hello7%-falcon`)

### 6. Attack Simulator

An interactive modal that simulates real-world password attacks on the entered password. Three attack types:

**Dictionary Attack:**
- Checks against a list of the top 85 most common passwords
- Also checks with common suffixes (1, 123, !, 2024, etc.)
- Shows real-time attempt progress in a terminal UI
- Reports the exact wordlist position where a match would be found

**Pattern Attack:**
- Detects l33t substitutions and reverses them
- Identifies keyboard walks, year patterns, and sequences
- Generates pattern variations and tests each one
- Shows the decoded/transformed versions in the terminal

**Brute-Force Attack:**
- Analyzes character set (lower, upper, digits, special)
- Simulates progressive keyspace exploration by length
- Calculates realistic crack times based on GPU hash rate
- Reports entropy in bits

All attacks display in a styled terminal with real-time stats (attempts count, time elapsed, progress percentage).

### 7. Privacy Inspector

A side-by-side visualization of the k-anonymity process showing:
- The masked password
- The full SHA-1 hash
- The prefix (sent to API) vs suffix (kept local)
- The API request and response format

Educational content explains why each step protects privacy.

---

## Technologies Used

| Technology | Role | How It's Loaded |
|-----------|------|-----------------|
| **HTML5** | Application structure | Native |
| **CSS3** | Custom animations & transitions | `styles.css` (local file) |
| **Tailwind CSS** | Utility-first styling framework | CDN (`cdn.tailwindcss.com`) |
| **JavaScript (Vanilla ES2017+)** | All application logic | `app.js` (local file) |
| **zxcvbn** | Password strength estimation | CDN (`cdnjs.cloudflare.com`) |
| **Have I Been Pwned API** | Breach data via k-anonymity | REST API (`api.pwnedpasswords.com`) |
| **Web Crypto API** | SHA-1 hashing | Built into all modern browsers |
| **Google Fonts** | Inter + JetBrains Mono typefaces | CDN (`fonts.googleapis.com`) |
| **SVG** | Icons and illustrations | Inline in HTML |

---

## Setup & Launch

Since ShieldCheck is a pure frontend application, **no build step, package manager, or server-side setup is required.**

### Option 1: Direct File Open (Simplest)

Open `index.html` directly in any modern browser:

```bash
start index.html
```

Or double-click `index.html` in File Explorer.

> **Note:** Some browsers may restrict `fetch()` API calls when using the `file://` protocol. If the breach check doesn't work, use Option 2 or 3.

### Option 2: Python HTTP Server

```bash
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

### Option 3: Node.js HTTP Server

```bash
npx http-server . -p 8080
```

Then open `http://localhost:8080` in your browser.

### Option 4: VS Code Live Server

If using VS Code, install the **Live Server** extension, right-click `index.html`, and select **"Open with Live Server"**.

### Requirements

- A modern browser with support for:
  - Web Crypto API (Chrome 37+, Firefox 34+, Safari 7+, Edge 79+)
  - `fetch()` API (Chrome 42+, Firefox 39+, Safari 10+, Edge 14+)
  - `async`/`await` (Chrome 55+, Firefox 52+, Safari 10.1+, Edge 15+)
- Internet connection (for initial page load CDNs and breach checking)

---

## Security & Privacy

### What leaves your device
- **Nothing** during password analysis (all local)
- **5 characters of the SHA-1 hash** when checking breaches (via k-anonymity)
- CDN requests for Tailwind CSS, zxcvbn, and Google Fonts on first load

### What NEVER leaves your device
- Your password (in any form)
- The full SHA-1 hash
- Any keystroke data or analytics
- Any form data or submissions

### Zero-knowledge guarantee
The k-anonymity protocol ensures that even if the HIBP API were malicious, it could only determine that your password's hash starts with a specific 5-character prefix — which matches ~500 other passwords. It cannot determine the full hash or the original password.
