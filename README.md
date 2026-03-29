# ShieldCheck - Password Security Analyzer

![ShieldCheck](https://img.shields.io/badge/ShieldCheck-Security-00d4ff?style=for-the-badge&labelColor=0a0e17)
![Privacy](https://img.shields.io/badge/Privacy-Zero%20Knowledge-a855f7?style=for-the-badge&labelColor=0a0e17)
![HTML5](https://img.shields.io/badge/HTML5-Pure%20JS-brightgreen?style=for-the-badge&labelColor=0a0e17)

> **Password Security Made Transparent** — A secure-by-design web application that evaluates password entropy, simulates brute-force attacks, and checks for data breaches using privacy-preserving API calls. Unlike basic "character-counting" checkers, ShieldCheck performs real pattern-based analysis to reveal why your password is (or isn't) secure.

---

## Executive Summary

ShieldCheck is a client-side password security analyzer that exposes the hidden weaknesses in common password practices. By leveraging the [zxcvbn](https://github.com/dropbox/zxcvbn) pattern-based entropy engine and the Have I Been Pwned (HIBP) k-Anonymity API, it provides **honest, educational feedback** without ever transmitting your actual password.

Unlike superficial checkers that rate "Password123!" as "strong" based solely on character variety, ShieldCheck recognizes that pattern-based attacks (dictionary words, l33t speak, keyboard walks, dates) crack most real-world passwords in seconds — not centuries.

---

## Core Security Features

### k-Anonymity Breach Checking

When you check if your password has appeared in a data breach, ShieldCheck uses the [HIBP API](https://haveibeenpwned.com/API/v3#PwnedPasswords) with a technique called **k-Anonymity** to ensure your password never leaves your browser in a recognizable form:

```
1. SHA-1 Hash (Browser Only)
   "Password123!" → "8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86ABF"

2. Split Hash
   Prefix (sent):   "8D969E"  (first 5 chars)
   Suffix (local):  "EF6ECAD3C29A3A629280E686CF0C3F5D5A86ABF" (35 chars)

3. API Call (Privacy-Preserving)
   GET https://api.pwnedpasswords.com/range/8D969E
   → Returns ~500 hash suffixes matching this prefix

4. Local Match
   Compare your suffix against returned list — if found, your password is compromised.
```

**Your full password hash never touches the server.** The API only sees a prefix, making it impossible to identify which specific password you searched for among millions of possible matches.

### Entropy-Based Scoring

ShieldCheck integrates **zxcvbn** (used by Dropbox), a pattern-based password strength estimator that recognizes:

| Pattern Type | Example | Why It Fails |
|--------------|---------|--------------|
| **Dictionary Words** | `password`, `letmein` | Rainbow tables & wordlists |
| **L33t Speak** | `P@$$w0rd!` | Trivial substitution reversal |
| **Keyboard Walks** | `qwerty`, `1qaz2wsx` | Common spatial patterns |
| **Repeated/ Sequences** | `aaaaaa`, `abc123` | Low entropy density |
| **Dates & Years** | `1990`, `March2024` | Social engineering targets |
| **Common Passwords** | `trustno1`, `admin` | Top breach lists |

The scoring system rates passwords 0-4 based on estimated guessability, providing realistic feedback rather than false confidence.

### Hardware-Specific Cracking Estimates

The "Time to Crack" feature calculates realistic attack scenarios using real-world hash rates:

| Hardware | Hash Rate | Use Case |
|----------|-----------|----------|
| **Laptop (CPU)** | ~10,000 H/s | Script kiddies, opportunistic attacks |
| **RTX 4090 (GPU)** | ~200,000,000 H/s | Dedicated crackers, mid-tier threat |
| **Botnet/Cloud** | ~100,000,000,000 H/s | Nation-state actors, massive resources |

These estimates use SHA-1 (the same algorithm used by HIBP), so they're directly applicable to real breach scenarios. A password that takes "506 years" on a gaming GPU might take only "0.4 days" on a sophisticated cloud cluster.

---

## Technical Stack

| Technology | Purpose |
|-------------|---------|
| **Vanilla JavaScript** | Zero framework overhead, maximum performance |
| **Tailwind CSS** | Utility-first styling with custom cyber theme |
| **Web Crypto API** | Native browser SHA-1 hashing (no external dependencies) |
| **zxcvbn** | Pattern-based entropy analysis |
| **HIBP API** | Privacy-preserving breach checking via k-Anonymity |
| **Google Fonts** | JetBrains Mono (terminal aesthetic) + Inter (UI) |

---

## Security Concepts & Lessons Learned

### Length vs. Complexity: The Passphrase Advantage

Traditional advice demanded "complex" passwords with uppercase, lowercase, numbers, and symbols. This led to predictable patterns like `P@ssw0rd!` — which zxcvbn cracks instantly.

**ShieldCheck promotes passphrases** because they offer superior entropy through length:

```
Short & Complex:  P@ssw0rd!123  →  ~11 characters → crackable in minutes
Long & Memorable: purple-elephant-storm-anchor  →  ~32 characters → crackable in centuries
```

A 4-word passphrase (~25-30 characters) with random words has entropy of `log2(wordlist_size^4)`, which scales far better than character-substitution tricks.

### Client-Side Privacy: Zero-Knowledge Architecture

All sensitive operations happen **exclusively in your browser**:

- Passwords are never sent to any server
- SHA-1 hashing uses the Web Crypto API locally
- The HIBP API only receives a 5-character hash prefix
- No analytics, no tracking, no logging

This is the essence of **zero-knowledge security**: the server that helps you check breaches learns nothing about your password.

### Dictionary vs. Brute-Force: Why Pattern Detection Matters

| Attack Type | How It Works | ShieldCheck's Defense |
|-------------|--------------|------------------------|
| **Brute-Force** | Tries every possible combination | Length makes this mathematically infeasible |
| **Dictionary** | Tries common words & variations | zxcvbn detects and warns about dictionary patterns |
| **Pattern-Based** | Exploits keyboard walks, dates, sequences | Recognizes spatial patterns and common dates |
| **Credential Stuffing** | Uses breached password lists | HIBP k-Anonymity check catches exposed passwords |

The "Simulate Attack" feature visually demonstrates why pattern-heavy passwords fail — showing characters being "cracked" one by one against a simulated hash rate.

---

## How to Run

### Option 1: Open Directly
```bash
# Simply open index.html in any modern browser
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Option 2: Local Server (Recommended for Development)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then visit http://localhost:8000
```

### Option 3: Live Demo
> *[Add your deployed URL here, e.g., GitHub Pages, Netlify, Vercel]*

---

## Browser Support

ShieldCheck requires a modern browser with Web Crypto API support:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 37+ | Fully Supported |
| Firefox | 34+ | Fully Supported |
| Safari | 11+ | Fully Supported |
| Edge | 12+ | Fully Supported |

---

## Privacy Guarantee

**Your password never leaves your device.** Here's the complete data flow:

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR BROWSER                          │
│                                                             │
│  Password Input                                             │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────┐                                        │
│  │  SHA-1 Hash    │ ◄── Web Crypto API (local)             │
│  └────────┬────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐     ┌─────────────────────────────┐    │
│  │  Split Hash    │     │  Send only 5-char prefix   │    │
│  │  Prefix+Suffix │ ──► │  to HIBP API               │    │
│  └─────────────────┘     └─────────────────────────────┘    │
│                                                             │
│  Local comparison determines if password was found.         │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
shieldcheck/
├── index.html      # Complete single-file application
├── README.md       # This documentation
└── [assets/]       # (Optional) Images, icons if separated
```

---

## License

MIT License — Use it, learn from it, improve it.

---

## Author

**Farhan Naser** — Cybersecurity enthusiast and software developer.

*Built to demonstrate understanding of password security, k-Anonymity, and zero-knowledge principles.*

---

## Acknowledgments

- [Dropbox](https://dropbox.com) for open-sourcing [zxcvbn](https://github.com/dropbox/zxcvbn)
- [Troy Hunt](https://haveibeenpwned.com) for the HIBP API and k-Anonymity model
- [Tailwind CSS](https://tailwindcss.com) for the utility-first styling framework
