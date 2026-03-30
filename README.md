# ShieldCheck

### Password Security Analyzer & Attack Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Security: Zero-Knowledge](https://img.shields.io/badge/Security-Zero--Knowledge-brightgreen.svg)](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsRange)
[![Platform: Browser](https://img.shields.io/badge/Platform-Browser-orange.svg)](https://github.com/farhannz/ShieldCheck)
[![API: HIBP k-Anonymity](https://img.shields.io/badge/API-HIBP%20k--Anonymity-purple.svg)](https://haveibeenpwned.com/)

> A client-side cybersecurity tool that analyzes password strength, simulates real-world attacks, and checks breach exposure — all without your password ever leaving your browser.

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Core Features](#core-features)
- [How It Works](#how-it-works)
- [Security Architecture](#security-architecture)
- [Technical Deep Dive](#technical-deep-dive)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Privacy Guarantee](#privacy-guarantee)
- [Why This Matters](#why-this-matters)
- [Author](#author)

---

## Overview

ShieldCheck is a browser-based password security analyzer that goes beyond simple strength meters. It models how actual attackers compromise passwords — dictionary attacks, pattern exploitation, and brute-force campaigns — giving users concrete evidence of their password's vulnerability.

Unlike typical password checkers that display vague warnings like "weak" or "strong," ShieldCheck shows you exactly *why* your password is vulnerable and *how* an attacker would crack it.

---

## The Problem

Most password strength tools are misleading:

| Tool Behavior | Reality |
|---------------|---------|
| `P@ssw0rd!` shows "Strong" | Cracked instantly — it's in every wordlist |
| `123456789` shows "Medium" | Top 3 most common password globally |
| `qwerty` shows "OK" | First pattern attackers try |

These tools measure **complexity** (character variety) rather than **security** (resistance to actual attacks). A password like `P@ssw0rd!123` contains uppercase, symbols, and numbers — but takes less than a second to crack because it's a predictable variation of `password`.

ShieldCheck bridges this gap by simulating real attack strategies, not arbitrary complexity scores.

---

## Core Features

### 1. Entropy-Based Strength Analysis

Uses [zxcvbn](https://github.com/dropbox/zxcvbn) (developed by Dropbox) for pattern-aware password scoring:

```
Score: 3/4 — Strong

Detected patterns:
├── Dictionary word: "dragon"
├── Date pattern: "2024"
└── Sequence: "123"

Suggestions:
├── Avoid dictionary words
└── Consider a longer passphrase
```

**Detected pattern types:**
- Dictionary words (English, names, surnames)
- L33t substitutions (`0`→`o`, `3`→`e`, `@`→`a`)
- Keyboard patterns (`qwerty`, `asdf`, `12345`)
- Spatial walks (keyboard adjacency)
- Repeated characters (`aaa`, `111`)
- Years and dates (`1990`, `2024`)
- Sequences (`abc`, `123`, `zyx`)

---

### 2. Realistic Attack Simulation

The attack simulator models actual cracking methodologies, not random animations.

#### Dictionary Attack
Simulates attackers starting with common passwords:
```
$ launching dictionary attack...
$ wordlist: top 80 common passwords
$ trying: password
$ trying: 123456
$ trying: letmein
$ trying: admin
...
$ MATCH FOUND at position 15!
$ total attempts: 15
$ real crack time (RTX 4090): instant
```

#### Pattern-Based Attack
Detects exploitable patterns and reverses them:
```
$ detected: l33t substitutions
$ converting "P@ssw0rd" → "password"
$ detected: keyboard pattern "qwerty"
$ MATCH FOUND!
```

#### Brute Force Attack
Simulates progressive keyspace exhaustion:
```
$ attack type: BRUTE FORCE
$ password length: 8
$ charset: mixed case + numbers
$ entropy: 38 bits
$ trying length: 6...
$ trying length: 7...
$ trying length: 8...
$ real crack time (RTX 4090): 4.2 hours
```

---

### 3. Hardware-Based Crack Time Estimation

Realistic time estimates based on actual hardware benchmarks:

| Hardware | Hash Rate | Use Case |
|----------|-----------|----------|
| CPU (laptop) | 10,000 H/s | Offline attack on stolen database |
| GPU (RTX 4090) | 200,000,000 H/s | Single-machine cracking |
| Cloud/Botnet | 100,000,000,000 H/s | Organized threat actors |

These aren't hypothetical — SHA-1 hash rates for these hardware classes are well-documented.

---

### 4. Breach Detection with k-Anonymity

Checks if your password exists in known data breaches **without transmitting the password**.

**How it works:**

1. Password is SHA-1 hashed locally (browser's Web Crypto API)
2. Only the first 5 characters of the hash are sent to Have I Been Pwned
3. API returns ~500 hash suffixes matching that prefix
4. Comparison happens entirely in your browser

```
Example:
Password: "mypassword"
SHA-1:    "CBFDA5..." → Send "CBFDA" to API
          "5AC72..."  → Keep local, never transmitted

Result: Found in 3,847,483 breaches
```

This is the same k-Anonymity model used by 1Password, Bitwarden, and Have I Been Pwned itself.

---

## How It Works

### Password Analysis Flow

```
User Input → zxcvbn Analysis → Pattern Detection → Strength Score
                                    ↓
                          Attack Simulation ← Educational Feedback
                                    ↓
                          Realistic Crack Time
```

### Attack Simulation Decision Tree

```
Password Input
      │
      ▼
┌─────────────────┐
│ Dictionary     │──→ Match in wordlist? ──→ CRACKED (instant)
│ Attack         │
└────────┬────────┘
         │ No match
         ▼
┌─────────────────┐
│ Pattern         │──→ L33t, keyboard, ──→ CRACKED (seconds)
│ Attack          │     sequences detected
└────────┬────────┘
         │ No pattern
         ▼
┌─────────────────┐
│ Brute Force     │──→ Calculate entropy ──→ CRACK TIME ESTIMATE
│ Attack          │     based on charset
└─────────────────┘
```

### k-Anonymity Verification Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    k-ANONYMITY MODEL                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. HASH LOCAL        2. SPLIT HASH         3. API REQUEST   │
│  ┌──────────┐         ┌──────────┐          ┌──────────────┐ │
│  │ SHA-1    │         │ PREFIX   │   SEND   │ api.pwned    │ │
│  │ (local)  │ ──────► │ (5 char) │ ──────►  │ passwords    │ │
│  └──────────┘         │ SUFFIX   │  KEEP    │ /range/XXXXX │ │
│                       └──────────┘          └──────────────┘ │
│                                                   │          │
│                                                   ▼          │
│  4. MATCH LOCAL       5. RESULT          6. ~500 HASHES     │
│  ┌──────────┐         ┌──────────┐      ┌──────────────┐   │
│  │ Compare  │ ◄────── │ Safe /   │ ◄──── │ Returned     │   │
│  │ locally  │         │ Exposed  │      │ (matches)    │   │
│  └──────────┘         └──────────┘      └──────────────┘   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Zero-Knowledge Design

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR BROWSER                          │
│                                                          │
│   Password ──► [SHA-1 Hash] ──► Compare with API       │
│       │                       response ──► Result        │
│       │                                                  │
│   Password NEVER transmitted over network                │
│   Only: SHA-1 prefix (5 hex chars)                     │
└─────────────────────────────────────────────────────────┘
```

### What ShieldCheck Cannot Do

- Log keystrokes (no keylogger functionality)
- Transmit passwords (all computation client-side)
- Store passwords (no persistence, no cookies)
- Intercept form data (input is explicit user action)

### Limitations

- JavaScript required (no server-side processing)
- Browser-dependent crypto implementation
- No protection against targeted attacks (phishing, social engineering)

---

## Technical Deep Dive

### Entropy vs Complexity

**Complexity** = character set size × password length
- `P@ssw0rd!` = 95⁸ combinations = 6.6 quadrillion

**Entropy** = log₂(effective keyspace after pattern analysis)
- `P@ssw0rd!` = effectively ~25 bits (it's `password` + predictable variations)

zxcvbn calculates **guesses** — the actual number of attempts a smart attacker would need. It recognizes 30,000+ common passwords, knows about l33t substitutions, keyboard patterns, dates, and sequences.

### Dictionary Attack Mechanics

Attackers don't try random combinations first. They prioritize:

1. **Top 100 passwords** (`password`, `123456`, `qwerty`)
2. **Variations with l33t** (`p@ssw0rd`, `l3tm31n`)
3. **Pattern + year** (`jordan2024`, `dragon2023`)
4. **Common surnames + numbers** (`michael123`, `jennifer99`)

ShieldCheck's dictionary attack simulation uses the same RockYou-style wordlists that real attackers use.

### Why Pattern Attacks Work

```
User thinks:     "P@$$w0rd!" is secure (complex)
Attacker sees:   "password" with predictable substitutions

Substitution mapping (known to all attackers):
@ → a    $ → s    0 → o    1 → i    ! → (nothing useful)
```

A GPU can try 200 million SHA-1 hashes per second. Against `P@$$w0rd!`, it needs fewer guesses than against `Tr0ub4dor&3` — even though the second looks "simpler."

---

## Screenshots

*Dashboard — Real-time password analysis*

```
┌─────────────────────────────────────────────────────────┐
│  ShieldCheck                              Dashboard     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Password: [••••••••••••••••••]  [👁]                   │
│                                                          │
│  Strength: ████████████░░░░░░░  Fair (60%)             │
│                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ Analysis    │ │ Breach      │ │ Crack Time  │       │
│  │ Score: 2/4  │ │ Status: —   │ │ GPU: 4.2hrs │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                          │
│  Pattern Detection:                                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐             │
│  │ L33t: ✓   │ │ Keyboard: │ │ Year: ✓   │             │
│  │ "0"→"o"   │ │ ✗ None    │ │ "2024"    │             │
│  └───────────┘ └───────────┘ └───────────┘             │
└─────────────────────────────────────────────────────────┘
```

*Attack Simulation — Dictionary Attack*

```
┌─────────────────────────────────────────────────────────┐
│  Attack Simulation                              [X]     │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │ $ initializing security analysis...              │  │
│  │ $ target: "P@ssw0rd123"                         │  │
│  │ $ detected attack type: DICTIONARY              │  │
│  │ $ launching dictionary attack...                 │  │
│  │ $ trying: password                               │  │
│  │ $ trying: 123456                                  │  │
│  │ $ trying: letmein                                 │  │
│  │ $ MATCH FOUND at position 47!                    │  │
│  │                                                  │  │
│  │ $ CRACKED!                                       │  │
│  │ $ real crack time: instant                       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  Attempts: 47    Time: 0.8s    Progress: 100%           │
└─────────────────────────────────────────────────────────┘
```

*Breach Check — k-Anonymity Visualization*

```
┌─────────────────────────────────────────────────────────┐
│  How k-Anonymity Protects Your Privacy                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐           │
│  │  1   │───►│  2   │───►│  3   │───►│  4   │           │
│  │ Hash │    │Split │    │Send  │    │Match │           │
│  │Local │    │Hash  │    │Prefix│    │Local │           │
│  └──────┘    └──────┘    └──────┘    └──────┘           │
│                                                          │
│  Your password: "mypassword"                            │
│  SHA-1: "CBFDA52E9A7F3C4E1..."                        │
│  Sent to API: "CBFDA" (only 5 chars)                  │
│  Kept local: "5AC72..." (never transmitted)           │
│                                                          │
│  ✓ Password remains 100% private                        │
└─────────────────────────────────────────────────────────┘
```

---

## Installation

### Option 1: Direct Open

```bash
# Clone or download the repository
git clone https://github.com/farhannz/ShieldCheck.git

# Open index.html directly in your browser
open index.html        # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

### Option 2: Local Server (Recommended)

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

---

## Privacy Guarantee

**Your passwords never leave your browser.**

| Step | What Happens |
|------|--------------|
| 1 | You type your password |
| 2 | SHA-1 hash computed locally (Web Crypto API) |
| 3 | Only first 5 characters of hash sent to HIBP API |
| 4 | API returns ~500 matching hash suffixes |
| 5 | Your browser compares locally, finds match |
| 6 | Full password hash never transmitted |

The hash suffix (35 characters) that would identify your exact password **never leaves your device**. Even if someone intercepts the API request, they cannot reverse-engineer your password from the 5-character prefix.

---

## Why This Matters

### For Users

Most people don't understand why `P@ssw0rd!` is worse than `correct-horse-battery-staple`. ShieldCheck makes this tangible by showing exactly how an attacker would approach their specific password.

### For Developers

Password security is often treated as an afterthought — "minimum 8 characters, one number, one symbol." This project demonstrates why those requirements are flawed and what better approaches look like.

### For Security Education

Seeing a dictionary attack try `password`, `letmein`, `admin` in rapid succession — and then your actual password appearing moments later — creates lasting intuition about password security that policy documents cannot.

---

## Author

**Farhan Naser**

Cybersecurity-focused developer specializing in privacy-preserving systems and attack modeling.

- GitHub: [@farhannz](https://github.com/farhannz)
- LinkedIn: [farhannaser](https://linkedin.com/in/farhannaser)

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Structure | HTML5 |
| Styling | Tailwind CSS |
| Logic | Vanilla JavaScript |
| Hashing | Web Crypto API |
| Strength Analysis | zxcvbn |
| Breach API | Have I Been Pwned |
| Fonts | Google Fonts (Inter, JetBrains Mono) |

---

## License

MIT License — free to use, modify, and distribute.

---

## References

- [zxcvbn: Low-Budget Password Strength Estimation](https://github.com/dropbox/zxcvbn)
- [Have I Been Pwned: k-Anonymity](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsRange)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [NIST SP 800-63B: Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
