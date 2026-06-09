// ============ WORD LIST FOR PASSPHRASE ============
const wordList = [
    'apple', 'brave', 'crane', 'delta', 'eagle', 'flame', 'grape', 'harbor', 'ivory', 'jazz',
    'karma', 'lemon', 'maple', 'noble', 'ocean', 'piano', 'queen', 'river', 'storm', 'tiger',
    'ultra', 'vivid', 'wheat', 'xenon', 'yacht', 'zebra', 'anchor', 'blaze', 'comet', 'dream',
    'ember', 'frost', 'globe', 'honor', 'image', 'joker', 'knife', 'lunar', 'metal', 'nectar',
    'orbit', 'prism', 'quest', 'radar', 'solar', 'tempo', 'unity', 'valor', 'windy', 'xerox',
    'youth', 'zesty', 'arrow', 'brush', 'cliff', 'dwarf', 'forge', 'giant', 'haste', 'index',
    'jasper', 'kayak', 'llama', 'mango', 'nexus', 'ozone', 'panda', 'quartz', 'robin', 'sphinx',
    'torch', 'urban', 'viper', 'whale', 'axiom', 'bliss', 'coral', 'dusk', 'flora', 'glyph',
    'haze', 'igloo', 'jelly', 'kiosk', 'latch', 'mocha', 'ninja', 'oasis', 'pearl', 'quirk',
    'realm', 'shelf', 'thorn', 'umbra', 'vortex', 'wisp', 'yonder', 'zinc', 'amber', 'bronze',
    'cider', 'dune', 'evoke', 'flint', 'grove', 'hazel', 'ionic', 'joust', 'kudos', 'lumen',
    'myrrh', 'nudge', 'olive', 'plumb', 'quill', 'ridge', 'sable', 'tide', 'usher', 'vinyl',
    'waltz', 'yacht', 'zonal', 'acorn', 'bloom', 'cedar', 'diver', 'eater', 'fable', 'gazer'
];

// ============ DOM ELEMENTS ============
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');
const eyeOffIcon = document.getElementById('eyeOffIcon');
const strengthBar = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');
const checkBreachBtn = document.getElementById('checkBreach');
const generatePassphraseBtn = document.getElementById('generatePassphrase');
const simulateAttackBtn = document.getElementById('simulateAttack');
const openPrivacyBtn = document.getElementById('openPrivacy');
const scoreDisplay = document.getElementById('scoreDisplay');
const feedbackList = document.getElementById('feedbackList');
const attackModal = document.getElementById('attackModal');
const privacyModal = document.getElementById('privacyModal');
const closeAttackModal = document.getElementById('closeAttackModal');
const closePrivacyModal = document.getElementById('closePrivacyModal');

// Breach elements
const breachInitial = document.getElementById('breachInitial');
const breachLoading = document.getElementById('breachLoading');
const breachSafe = document.getElementById('breachSafe');
const breachFound = document.getElementById('breachFound');
const breachError = document.getElementById('breachError');
const breachCount = document.getElementById('breachCount');
const errorMessage = document.getElementById('errorMessage');
const hashPreview = document.getElementById('hashPreview');

// Crack time elements
const crackLaptop = document.getElementById('crackLaptop');
const crackGPU = document.getElementById('crackGPU');
const crackCloud = document.getElementById('crackCloud');

// Pattern elements
const patternL33t = document.getElementById('patternL33t');
const patternL33tText = document.getElementById('patternL33tText');
const patternKeyboard = document.getElementById('patternKeyboard');
const patternKeyboardText = document.getElementById('patternKeyboardText');
const patternYear = document.getElementById('patternYear');
const patternYearText = document.getElementById('patternYearText');
const patternNone = document.getElementById('patternNone');

// Privacy elements
const privacyPassword = document.getElementById('privacyPassword');
const privacyHash = document.getElementById('privacyHash');
const privacyPrefix = document.getElementById('privacyPrefix');
const privacySuffix = document.getElementById('privacySuffix');
const privacyApiResponse = document.getElementById('privacyApiResponse');

// Strength config
const strengthConfig = [
    { label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-400', width: '20%' },
    { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-400', width: '40%' },
    { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400', width: '60%' },
    { label: 'Strong', color: 'bg-lime-500', textColor: 'text-lime-400', width: '80%' },
    { label: 'Very Strong', color: 'bg-green-500', textColor: 'text-green-400', width: '100%' }
];

// Hardware benchmarks (hashes per second)
const hardwareBenchmarks = {
    laptop: 1e4,      // 10,000 H/s
    gpu: 2e5,         // 200,000 H/s (RTX 4090)
    cloud: 1e11       // 100 Billion H/s
};

// ============ UTILITY FUNCTIONS ============
function arrayBufferToHex(buffer) {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).join('');
}

async function sha1(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    return arrayBufferToHex(hashBuffer);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    if (num >= 1e15) return (num / 1e15).toFixed(1) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
}

function formatTime(seconds) {
    if (seconds < 1) return 'instant';
    if (seconds < 60) return seconds.toFixed(1) + 's';
    if (seconds < 3600) return (seconds / 60).toFixed(1) + 'min';
    if (seconds < 86400) return (seconds / 86400).toFixed(1) + 'days';
    if (seconds < 31536000) return (seconds / 31536000).toFixed(1) + 'years';
    if (seconds < 31536000 * 1000) return (seconds / 31536000).toFixed(0) + 'years';
    if (seconds < 31536000 * 1e6) return (seconds / 31536000 / 1000000).toFixed(0) + 'M years';
    if (seconds < 31536000 * 1e9) return (seconds / 31536000 / 1e9).toFixed(0) + 'B years';
    return (seconds / 31536000 / 1e12).toFixed(0) + 'Trillion years';
}

// ============ PATTERN DETECTION ============
function detectL33tSpeak(password) {
    // Check for common l33t substitutions: 0=o, 1=i, 3=e, 4=a, 5=s, 7=t, @=a, $=s
    const l33tRegex = /[0-3@$]+/g;
    const matches = password.match(l33tRegex);
    if (matches) {
        // Show what the substitutions actually mean
        const examples = matches.slice(0, 2).map(m => {
            let decoded = m.replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
                           .replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
                           .replace(/@/g, 'a').replace(/\$/g, 's');
            return '"' + m + '" \u2192 "' + decoded + '"';
        }).join(', ');
        return 'Substitutions like ' + examples + ' are easy to guess';
    }
    return null;
}

function detectKeyboardPatterns(password) {
    const keyboardPatterns = ['qwerty', 'qwertyuiop', 'asdfgh', 'asdfghjkl', 'zxcvbn', 'zxcvbnm', '1234567890', 'qazwsx', 'qazwsxedc', '1qaz2wsx', 'qa1ws2', 'poiuy', 'lkjhgf'];
    const lower = password.toLowerCase();
    for (const pattern of keyboardPatterns) {
        if (lower.includes(pattern)) {
            return 'Common keyboard walk "' + pattern + '" is in top attack lists';
        }
    }
    return null;
}

function detectCommonYears(password) {
    const yearRegex = /(19[7-9]\d|20[0-2]\d)/g;
    const matches = password.match(yearRegex);
    if (matches) {
        const years = [...new Set(matches)].slice(0, 3).join(', ');
        return 'Birth year ' + years + ' is easy to find on social media';
    }
    return null;
}

// ============ CRACK TIME CALCULATION ============
function calculateCrackTimes(password) {
    if (!password) {
        crackLaptop.textContent = '\u2014';
        crackGPU.textContent = '\u2014';
        crackCloud.textContent = '\u2014';
        return;
    }

    // Use zxcvbn's actual guess count for accurate calculation
    const result = zxcvbn(password);
    const guesses = result.guesses;

    // Time for each hardware
    const laptopTime = guesses / hardwareBenchmarks.laptop;
    const gpuTime = guesses / hardwareBenchmarks.gpu;
    const cloudTime = guesses / hardwareBenchmarks.cloud;

    crackLaptop.textContent = formatTime(laptopTime);
    crackGPU.textContent = formatTime(gpuTime);
    crackCloud.textContent = formatTime(cloudTime);
}

// ============ UPDATE STRENGTH METER ============
function updateStrengthMeter(password) {
    if (!password) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'h-full rounded-full transition-all duration-300 strength-glow progress-stripes';
        strengthLabel.textContent = 'Enter a password';
        strengthLabel.className = 'text-sm font-medium text-gray-500';
        scoreDisplay.textContent = '\u2014';
        scoreDisplay.className = 'text-4xl font-bold font-mono text-gray-600';
        feedbackList.innerHTML = '<div class="text-gray-500 text-sm italic">Analysis will appear here</div>';
        checkBreachBtn.disabled = true;
        simulateAttackBtn.disabled = true;
        calculateCrackTimes('');
        hideAllPatterns();
        return;
    }

    const result = zxcvbn(password);
    const config = strengthConfig[result.score];

    strengthBar.style.width = config.width;
    strengthBar.className = 'h-full rounded-full transition-all duration-300 strength-glow progress-stripes ' + config.color;
    strengthLabel.textContent = config.label;
    strengthLabel.className = 'text-sm font-medium ' + config.textColor;
    scoreDisplay.textContent = result.score;
    scoreDisplay.className = 'text-4xl font-bold font-mono ' + config.textColor;

    // Calculate crack times
    calculateCrackTimes(password);

    // Pattern detection
    updatePatternAnalysis(password);

    // Generate feedback
    let feedbackHTML = '';

    if (result.sequence.length > 0) {
        const patterns = [...new Set(result.sequence.map(item => item.pattern))];
        if (patterns.includes('dictionary') || patterns.includes('spatial')) {
            feedbackHTML += '<div class="flex items-start space-x-2 text-yellow-500">' +
                '<svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>' +
                '<span class="text-sm">Common pattern detected</span></div>';
        }
    }

    const crackTime = result.crack_times_display.offline_slow_hashing_1e4_per_second;
    feedbackHTML += '<div class="flex items-center space-x-2 text-gray-400">' +
        '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' +
        '<span class="text-sm">Crack time: ' + crackTime + '</span></div>';

    if (result.feedback.suggestions && result.feedback.suggestions.length > 0) {
        result.feedback.suggestions.slice(0, 2).forEach(suggestion => {
            feedbackHTML += '<div class="flex items-start space-x-2 text-cyan-400">' +
                '<svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>' +
                '<span class="text-sm">' + suggestion + '</span></div>';
        });
    }

    feedbackList.innerHTML = feedbackHTML || '<div class="text-green-400 text-sm">\u2713 No obvious weaknesses found</div>';

    checkBreachBtn.disabled = false;
    simulateAttackBtn.disabled = false;
}

function updatePatternAnalysis(password) {
    const l33t = detectL33tSpeak(password);
    const keyboard = detectKeyboardPatterns(password);
    const year = detectCommonYears(password);

    hideAllPatterns();

    if (l33t || keyboard || year) {
        patternNone.classList.add('hidden');
        if (l33t) {
            patternL33t.classList.remove('hidden');
            patternL33tText.textContent = l33t;
        }
        if (keyboard) {
            patternKeyboard.classList.remove('hidden');
            patternKeyboardText.textContent = keyboard;
        }
        if (year) {
            patternYear.classList.remove('hidden');
            patternYearText.textContent = year;
        }
    } else {
        patternNone.classList.remove('hidden');
    }
}

function hideAllPatterns() {
    patternL33t.classList.add('hidden');
    patternKeyboard.classList.add('hidden');
    patternYear.classList.add('hidden');
    patternNone.classList.remove('hidden');
}

// ============ PASSPHRASE ENHANCER ============
function generatePassphrase() {
    const originalPassword = passwordInput.value;

    if (!originalPassword) {
        // If no password, generate a memorable passphrase
        const wordCount = 4;
        let words = [];
        for (let i = 0; i < wordCount; i++) {
            words.push(wordList[Math.floor(Math.random() * wordList.length)]);
        }
        const passphrase = words.join('-');
        const entropy = Math.log2(Math.pow(wordList.length, wordCount));

        passwordInput.type = 'text';
        passwordInput.value = passphrase;
        eyeIcon.classList.add('hidden');
        eyeOffIcon.classList.remove('hidden');

        updateStrengthMeter(passphrase);

        // Show entropy info
        feedbackList.innerHTML = '<div class="flex items-start space-x-2 text-green-400">' +
            '<svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>' +
            '<span class="text-sm">Generated memorable passphrase with <span class="font-mono">' + entropy.toFixed(1) + '</span> bits entropy</span></div>';
        return;
    }

    // Enhance the existing password: capitalize first letter, add a number and symbol
    let enhanced = originalPassword;

    // Keep first 2-3 characters as-is for recognizability
    const keepCount = Math.min(3, Math.floor(originalPassword.length / 2));
    const kept = originalPassword.substring(0, keepCount);

    // Capitalize first letter if it's a letter
    const firstChar = enhanced.charAt(0);
    if (firstChar.match(/[a-z]/)) {
        enhanced = firstChar.toUpperCase() + enhanced.substring(1);
    }

    // Add random number and symbol at the end
    const numbers = '123456789';
    const symbols = '!@#$%^&*';
    const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
    const randomSym = symbols[Math.floor(Math.random() * symbols.length)];
    enhanced += randomNum + randomSym;

    // Add a memorable word suffix
    const suffixWord = wordList[Math.floor(Math.random() * wordList.length)];
    enhanced = enhanced + '-' + suffixWord;

    passwordInput.type = 'text';
    passwordInput.value = enhanced;
    eyeIcon.classList.add('hidden');
    eyeOffIcon.classList.remove('hidden');

    updateStrengthMeter(enhanced);

    // Show what was kept and what was added
    feedbackList.innerHTML = '<div class="flex items-start space-x-2 text-green-400">' +
        '<svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>' +
        '<span class="text-sm">Enhanced! Kept "<span class="font-mono text-white">' + escapeHtml(kept) + '</span>" + added capitals, numbers, symbol & word</span></div>';
}

// ============ ATTACK SIMULATOR ============

// Hardware benchmarks (hashes per second)
const attackHardware = {
    laptop: 1e4,      // 10,000 H/s
    gpu: 2e5,         // 200,000 H/s (RTX 4090)
    cloud: 1e11       // 100 Billion H/s
};

// Common passwords sorted by popularity (top 80 for simulation)
const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
    'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
    'qazwsx', 'michael', 'football', 'password1', 'password123', 'welcome',
    'jesus', 'ninja', 'mustang', 'admin', 'admin123', 'login', 'hello',
    'charlie', 'donald', 'hello123', 'pass123', 'starwars', 'freedom',
    'whatever', 'jordan', 'jennifer', 'hunter', 'amanda', 'joshua', 'biteme',
    'matthew', 'daniel', 'andrew', 'taylor', 'jessica', 'thomas', 'robert',
    'chicken', 'password12', 'qwerty123', 'batman', 'trustme', 'access',
    'killer', 'mother', 'jordan23', 'rockyou', 'princess', 'qwerty1',
    'football1', 'maggie', 'pepper', 'zxcvbn', 'zxcvbnm', 'internet', 'computer',
    'secret', 'orange', 'silver', 'golden', 'purple', 'yellow', 'diamond',
    ' platinum', 'gold', 'system', 'service', 'manager', 'developer', 'student'
];

// Common dictionary words for passphrase attacks
const dictionaryWords = [
    'apple', 'brave', 'crane', 'delta', 'eagle', 'flame', 'grape', 'harbor', 'ivory', 'jazz',
    'karma', 'lemon', 'maple', 'noble', 'ocean', 'piano', 'queen', 'river', 'storm', 'tiger',
    'dragon', 'falcon', 'ghost', 'hawk', 'joker', 'knife', 'lunar', 'metal', 'orbit', 'prism',
    'quest', 'radar', 'solar', 'tempo', 'unity', 'valor', 'windy', 'xerox', 'anchor', 'blaze',
    'comet', 'dream', 'ember', 'frost', 'globe', 'honor', 'image', 'kiosk', 'latch', 'mocha'
];

// L33t substitution mapping
const l33tSubstitutions = {
    '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't',
    '@': 'a', '$': 's', '!': 'i', '2': 'z', '6': 'g', '8': 'b'
};

// Keyboard patterns
const keyboardPatterns = [
    'qwerty', 'qwertyuiop', 'asdfgh', 'asdfghjkl', 'zxcvbn', 'zxcvbnm',
    '1234567890', 'qazwsx', 'qazwsxedc', '1qaz2wsx', 'qa1ws2', 'poiuy', 'lkjhgf',
    'qweasd', 'asdqwe', 'zxcasd', '!@#$%', 'qazxsw', 'edcrfv'
];

// Reverse l33t substitution
function reverseL33t(word) {
    return word.split('').map(char => {
        // Find if this char can be unl33ted
        for (const [leet, normal] of Object.entries(l33tSubstitutions)) {
            if (leet === char) return normal;
        }
        return char;
    }).join('');
}

// Detect which attack type would be most effective
function detectAttackType(password) {
    const lower = password.toLowerCase();
    const result = zxcvbn(password);
    const patterns = result.sequence.map(s => s.pattern);

    // Check for common password match
    if (commonPasswords.includes(lower) ||
        commonPasswords.includes(lower.replace(/[0-9!@#$%^&*]/g, ''))) {
        return { type: 'dictionary', reason: 'Common password', confidence: 0.95 };
    }

    // Check for l33t speak
    const hasL33t = /[0-3@$!]/.test(password);
    if (hasL33t && patterns.includes('dictionary')) {
        const unl33ted = reverseL33t(lower);
        if (commonPasswords.includes(unl33ted) || commonPasswords.includes(unl33ted.replace(/[0-9]/g, ''))) {
            return { type: 'pattern', reason: 'L33t-spelled common word', confidence: 0.9 };
        }
        return { type: 'pattern', reason: 'L33t substitutions detected', confidence: 0.75 };
    }

    // Check for keyboard pattern
    for (const pattern of keyboardPatterns) {
        if (lower.includes(pattern)) {
            return { type: 'pattern', reason: `Keyboard pattern "${pattern}"`, confidence: 0.9 };
        }
    }

    // Check for year pattern
    const yearMatch = password.match(/(19[7-9]\d|20[0-2]\d)/);
    if (yearMatch) {
        return { type: 'pattern', reason: `Year pattern ${yearMatch[0]}`, confidence: 0.85 };
    }

    // Check for sequential numbers
    const seqMatch = password.match(/(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)+/);
    if (seqMatch) {
        return { type: 'pattern', reason: 'Sequential numbers', confidence: 0.8 };
    }

    // Check if it's a dictionary/passphrase
    if (patterns.includes('dictionary') || patterns.includes('spatial')) {
        return { type: 'dictionary', reason: 'Contains dictionary word', confidence: 0.7 };
    }

    // Check for repeat patterns
    if (/(.)\1{2,}/.test(password)) {
        return { type: 'pattern', reason: 'Repeated characters', confidence: 0.7 };
    }

    // Check length - short passwords are brute-forcible
    if (password.length <= 6) {
        return { type: 'bruteforce', reason: 'Short password (low entropy)', confidence: 0.6 };
    }

    // Default - strong password, would need brute force
    return { type: 'bruteforce', reason: 'High entropy, no patterns', confidence: 0.5 };
}

// Calculate realistic crack time based on zxcvbn guesses
function calculateRealisticCrackTime(password, attackType) {
    const result = zxcvbn(password);
    const guesses = result.guesses;

    // Adjust guesses based on attack effectiveness
    let effectiveGuesses;
    switch (attackType) {
        case 'dictionary':
            effectiveGuesses = Math.min(guesses, commonPasswords.length * 10);
            break;
        case 'pattern':
            effectiveGuesses = Math.min(guesses, 10000);
            break;
        default:
            effectiveGuesses = guesses;
    }

    const gpuSpeed = attackHardware.gpu;
    return effectiveGuesses / gpuSpeed;
}

// Update progress bar in stats
function updateProgress(percent, attemptCount, elapsed) {
    const attemptCountEl = document.getElementById('attemptCount');
    const timeElapsedEl = document.getElementById('timeElapsed');
    const charsCrackedEl = document.getElementById('charsCracked');

    if (attemptCountEl) attemptCountEl.textContent = formatNumber(attemptCount);
    if (timeElapsedEl) timeElapsedEl.textContent = elapsed + 's';
    if (charsCrackedEl) charsCrackedEl.textContent = Math.floor(percent) + '%';
}

// Simulate dictionary attack
async function runDictionaryAttack(password, terminal, updateStats) {
    const lower = password.toLowerCase();
    const totalPasswords = commonPasswords.length;
    const baseTime = 50; // ms per attempt

    // Calculate where in the wordlist we'd find it (simulated)
    let matchIndex = -1;
    let matchType = 'not_found';

    // Check exact match
    for (let i = 0; i < commonPasswords.length; i++) {
        if (lower === commonPasswords[i]) {
            matchIndex = i;
            matchType = 'exact';
            break;
        }
    }

    // Check with common suffixes
    if (matchIndex === -1) {
        for (let i = 0; i < commonPasswords.length; i++) {
            const base = commonPasswords[i];
            const suffixes = ['', '1', '123', '12', '!', '123!', '2024', '2023'];
            for (const suffix of suffixes) {
                if (lower === base + suffix) {
                    matchIndex = i;
                    matchType = 'withSuffix';
                    break;
                }
            }
            if (matchIndex !== -1) break;
        }
    }

    // Check dictionary word + numbers
    if (matchIndex === -1) {
        for (let i = 0; i < dictionaryWords.length; i++) {
            const base = dictionaryWords[i];
            const suffixes = ['', '1', '123', '2024', '99', '00'];
            for (const suffix of suffixes) {
                if (lower === base + suffix || lower === base.charAt(0).toUpperCase() + base.slice(1) + suffix) {
                    matchIndex = commonPasswords.length + i;
                    matchType = 'dictionaryWord';
                    break;
                }
            }
            if (matchIndex !== -1) break;
        }
    }

    // Simulate trying passwords
    const displayInterval = Math.max(1, Math.floor(totalPasswords / 25));
    const startTime = Date.now();
    let attempts = 0;

    for (let i = 0; i < totalPasswords; i++) {
        attempts++;
        const current = commonPasswords[i];

        // Show attempt every few iterations
        if (i % displayInterval === 0 || i < 10) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const progress = Math.min(95, Math.round((i / totalPasswords) * 100));
            updateStats(progress, attempts, elapsed);

            const displayWord = i < 15 ? current : '********';
            terminal.innerHTML += `<div class="text-red-400">$ trying: ${displayWord}</div>`;
            terminal.scrollTop = terminal.scrollHeight;
        }

        // Simulate finding the password
        if (matchIndex !== -1 && i >= matchIndex) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            const progress = 100;
            updateStats(progress, attempts, elapsed);

            terminal.innerHTML += `<div class="text-green-400 mt-3">$ MATCH FOUND at position ${i + 1}!</div>`;
            terminal.innerHTML += `<div class="text-gray-400">$ trying: "${current}"</div>`;
            terminal.scrollTop = terminal.scrollHeight;

            return {
                success: true,
                attempts: i + 1,
                elapsed: parseFloat(elapsed),
                method: matchType,
                password: current
            };
        }

        // Yield to UI periodically
        if (i % 50 === 0) {
            await sleep(baseTime / 2);
        }
    }

    // Not found in common passwords
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    updateStats(100, attempts, elapsed);

    return {
        success: false,
        attempts: attempts,
        elapsed: parseFloat(elapsed),
        method: 'not_found'
    };
}

// Simulate pattern-based attack
async function runPatternAttack(password, terminal, updateStats) {
    const lower = password.toLowerCase();
    const startTime = Date.now();
    let attempts = 0;

    terminal.innerHTML += `<div class="text-yellow-400">$ analyzing pattern...</div>`;
    await sleep(300);

    const detectedPatterns = [];

    if (/[0-3@$!]/.test(password)) {
        const unl33t = reverseL33t(lower);
        terminal.innerHTML += `<div class="text-yellow-400">$ detected: l33t substitutions</div>`;
        terminal.innerHTML += `<div class="text-gray-400">$ converting "${password}" \u2192 "${unl33t}"</div>`;
        detectedPatterns.push({ pattern: 'l33t', original: password, converted: unl33t });
        attempts++;
        updateStats(5, attempts, ((Date.now() - startTime) / 1000).toFixed(1));
        await sleep(200);
    }

    for (const kp of keyboardPatterns) {
        if (lower.includes(kp)) {
            terminal.innerHTML += `<div class="text-yellow-400">$ detected: keyboard pattern "${kp}"</div>`;
            detectedPatterns.push({ pattern: 'keyboard', value: kp });
            attempts++;
            updateStats(10 + attempts * 3, attempts, ((Date.now() - startTime) / 1000).toFixed(1));
            await sleep(200);
        }
    }

    const yearMatch = password.match(/(19[7-9]\d|20[0-2]\d)/);
    if (yearMatch) {
        terminal.innerHTML += `<div class="text-yellow-400">$ detected: year pattern "${yearMatch[0]}"</div>`;
        terminal.innerHTML += `<div class="text-gray-400">$ common years are often appended (birth year?)</div>`;
        detectedPatterns.push({ pattern: 'year', value: yearMatch[0] });
        attempts++;
        updateStats(10 + attempts * 3, attempts, ((Date.now() - startTime) / 1000).toFixed(1));
        await sleep(200);
    }

    const seqMatch = password.match(/(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)+/);
    if (seqMatch) {
        terminal.innerHTML += `<div class="text-yellow-400">$ detected: sequential pattern "${seqMatch[0]}"</div>`;
        detectedPatterns.push({ pattern: 'sequence', value: seqMatch[0] });
        attempts++;
        updateStats(10 + attempts * 3, attempts, ((Date.now() - startTime) / 1000).toFixed(1));
        await sleep(200);
    }

    terminal.innerHTML += `<div class="text-yellow-400">$ generating pattern mutations...</div>`;
    await sleep(300);

    // Build expanded variation list from detected patterns + wordlist
    const variationSet = new Set();

    for (const dp of detectedPatterns) {
        if (dp.pattern === 'l33t') {
            const b = dp.converted;
            variationSet.add(b);
            variationSet.add(b + '123');
            variationSet.add(b + '1');
            variationSet.add(b.charAt(0).toUpperCase() + b.slice(1));
            variationSet.add(b.charAt(0).toUpperCase() + b.slice(1) + '123');
            variationSet.add(b + '!');
            variationSet.add(b + '2024');
            variationSet.add(b + b.charAt(0));
            // Try unl33ted version with common suffixes on wordlist
            for (const w of commonPasswords.slice(0, 30)) {
                variationSet.add(w + '1');
                variationSet.add(w + '123');
                variationSet.add(b + w);
            }
        }
        if (dp.pattern === 'keyboard') {
            variationSet.add(dp.value);
            variationSet.add(dp.value + '123');
            variationSet.add(dp.value.charAt(0).toUpperCase() + dp.value.slice(1));
            variationSet.add(dp.value.charAt(0).toUpperCase() + dp.value.slice(1) + '!');
            variationSet.add(dp.value + '!');
            variationSet.add(dp.value + '2024');
            for (const w of commonPasswords.slice(0, 20)) {
                variationSet.add(w + dp.value);
                variationSet.add(dp.value + w);
            }
        }
        if (dp.pattern === 'year') {
            variationSet.add('password' + dp.value);
            variationSet.add('pass' + dp.value);
            variationSet.add('admin' + dp.value);
            variationSet.add('welcome' + dp.value);
            variationSet.add('user' + dp.value);
            variationSet.add(dp.value);
            variationSet.add(dp.value + dp.value.slice(-2));
            variationSet.add(dp.value + '!');
            for (const w of commonPasswords.slice(0, 20)) {
                variationSet.add(w + dp.value);
                variationSet.add(dp.value + w);
            }
        }
        if (dp.pattern === 'sequence') {
            variationSet.add(dp.value);
            variationSet.add(dp.value + 'a');
            variationSet.add('a' + dp.value);
            variationSet.add('pass' + dp.value);
            variationSet.add(dp.value + dp.value);
        }
    }

    // If no patterns detected but still running pattern attack, use default probes
    if (variationSet.size === 0) {
        for (const w of commonPasswords.slice(0, 40)) {
            variationSet.add(w);
            variationSet.add(w + '123');
            variationSet.add(w.charAt(0).toUpperCase() + w.slice(1));
        }
    }

    const variations = [...variationSet];
    terminal.innerHTML += `<div class="text-yellow-400">$ trying ${variations.length} pattern mutations...</div>`;
    terminal.innerHTML += `<div class="text-gray-400">$ depth: common words \u2192 suffix \u2192 mutate</div>`;

    let found = false;
    const batchSize = Math.max(1, Math.floor(variations.length / 15));

    for (let i = 0; i < variations.length; i++) {
        attempts++;
        const v = variations[i];
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const progress = Math.min(95, Math.round((i / variations.length) * 80 + 10));
        updateStats(progress, attempts, elapsed);

        if (i % batchSize === 0 || i < 5) {
            const masked = v.length > 8 ? v.substring(0, 4) + '...' + v.slice(-2) : v;
            terminal.innerHTML += `<div class="text-red-400">$ trying: "${masked}" (batch ${Math.floor(i / batchSize) + 1})</div>`;
            terminal.scrollTop = terminal.scrollHeight;
        }

        if (v.toLowerCase() === lower) {
            const elapsedFinal = ((Date.now() - startTime) / 1000).toFixed(2);
            updateStats(100, attempts, elapsedFinal);
            terminal.innerHTML += `<div class="text-green-400 mt-3">$ MATCH FOUND at variation ${i + 1}!</div>`;
            terminal.innerHTML += `<div class="text-gray-400">$ pattern attack success: "${v}" == "${password}"</div>`;
            found = true;
            return { success: true, attempts, elapsed: parseFloat(elapsedFinal), method: 'pattern_variation' };
        }

        if (i % 10 === 0) await sleep(20);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const finalProgress = detectedPatterns.length > 0 ? 100 : 30;
    updateStats(finalProgress, attempts, elapsed);
    terminal.innerHTML += `<div class="text-gray-400">$ pattern mutations exhausted (${variations.length} tried)</div>`;

    return { success: false, attempts, elapsed: parseFloat(elapsed), method: 'pattern_exhausted' };
}

// Simulate brute force attack
async function runBruteForceAttack(password, terminal, updateStats) {
    const result = zxcvbn(password);
    const guesses = result.guesses;
    const guessesLog10 = result.guesses_log10;
    const startTime = Date.now();
    const gpuSpeed = attackHardware.gpu;

    const crackTimeSeconds = guesses / gpuSpeed;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    let charsetSize = 0;
    let charsetParts = [];
    if (hasLower) { charsetSize += 26; charsetParts.push('a-z'); }
    if (hasUpper) { charsetSize += 26; charsetParts.push('A-Z'); }
    if (hasNumber) { charsetSize += 10; charsetParts.push('0-9'); }
    if (hasSpecial) { charsetSize += 32; charsetParts.push('!@#$%'); }

    terminal.innerHTML += `<div class="text-yellow-400">$ attack type: Brute Force</div>`;
    terminal.innerHTML += `<div class="text-gray-400">$ password length: ${password.length}</div>`;
    terminal.innerHTML += `<div class="text-gray-400">$ charset: ${charsetParts.join(' + ')} (${charsetSize} symbols)</div>`;
    terminal.innerHTML += `<div class="text-gray-400">$ keyspace size: ${formatNumber(Math.pow(charsetSize, password.length))}</div>`;
    terminal.innerHTML += `<div class="text-gray-400">$ zxcvbn entropy: ${guessesLog10.toFixed(1)} bits (${formatNumber(guesses)} guesses)</div>`;
    await sleep(300);

    const oneHour = 3600;
    const oneDay = 86400;
    const oneYear = 31536000;

    if (crackTimeSeconds <= oneHour) {
        terminal.innerHTML += `<div class="text-red-400">$ estimated crack time: ${formatTime(crackTimeSeconds)} (trivial)</div>`;
        await sleep(200);

        const totalAttempts = Math.round(guesses * 1.1);
        const displayMax = Math.min(totalAttempts, 8000);
        const scale = totalAttempts / displayMax;
        let displayIdx = 0;
        const sampleChars = [];
        for (let c = 32; c <= 126; c++) sampleChars.push(String.fromCharCode(c));

        for (let i = 0; i < displayMax; i++) {
            displayIdx++;
            const scaled = Math.round(displayIdx * scale);

            if (displayIdx % 400 === 0 || displayIdx < 5) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                const progress = Math.min(99, (displayIdx / displayMax) * 100);
                updateStats(progress, scaled, elapsed);

                if (displayIdx < 5) {
                    const probe = sampleChars[Math.floor(Math.random() * sampleChars.length)];
                    terminal.innerHTML += `<div class="text-red-400">$ probing: '${probe}' ... no match</div>`;
                } else {
                    terminal.innerHTML += `<div class="text-red-400">$ scanning keyspace: ${scaled.toLocaleString()} candidates</div>`;
                }
                terminal.scrollTop = terminal.scrollHeight;
            }
            if (displayIdx % 1500 === 0) await sleep(1);
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        updateStats(100, totalAttempts, elapsed);
        terminal.innerHTML += `<div class="text-green-400 mt-3">$ CRACKED after ~${formatNumber(totalAttempts)} attempts</div>`;

        return { success: true, attempts: totalAttempts, elapsed: parseFloat(elapsed), method: 'bruteforce' };

    } else if (crackTimeSeconds <= oneDay) {
        terminal.innerHTML += `<div class="text-yellow-400">$ estimated crack time: ${formatTime(crackTimeSeconds)}</div>`;
        terminal.innerHTML += `<div class="text-gray-400">$ running partial enumeration...</div>`;
        await sleep(200);

        const partialMax = 2500;
        const scaledTotal = Math.round(guesses * 0.03);
        let done = 0;

        for (let i = 0; i < partialMax; i++) {
            done++;
            const scaled = Math.round((done / partialMax) * scaledTotal);

            if (done % 150 === 0) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                const progress = 30 + (done / partialMax) * 35;
                updateStats(progress, scaled, elapsed);
                terminal.innerHTML += `<div class="text-red-400">$ depth ${done}/${partialMax}: ${scaled.toLocaleString()} combos (${charsetParts[0] || '?'}...)</div>`;
                terminal.scrollTop = terminal.scrollHeight;
            }
            if (done % 600 === 0) await sleep(1);
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const remaining = crackTimeSeconds - (crackTimeSeconds * 0.03);
        terminal.innerHTML += `<div class="text-yellow-400">$ TIMEOUT after ${scaledTotal.toLocaleString()} attempts</div>`;
        terminal.innerHTML += `<div class="text-gray-400">$ estimated remaining: ${formatTime(remaining)}</div>`;

        return { success: false, attempts: scaledTotal, elapsed: parseFloat(elapsed), method: 'timeout' };

    } else {
        terminal.innerHTML += `<div class="text-yellow-400">$ estimated crack time: ${formatTime(crackTimeSeconds)}</div>`;
        await sleep(300);
        terminal.innerHTML += `<div class="text-red-400">$ ABORT: attack economically infeasible</div>`;
        terminal.innerHTML += `<div class="text-gray-400">$ keyspace (${formatNumber(Math.pow(charsetSize, password.length))}) exceeds practical limits</div>`;
        terminal.innerHTML += `<div class="text-gray-400">$ at ${formatNumber(gpuSpeed)} H/s would require ${formatTime(crackTimeSeconds)}</div>`;
        updateStats(0, 0, '0.0');

        return { success: false, attempts: 0, elapsed: 0, method: 'infeasible' };
    }
}

// Main attack simulation orchestrator
async function simulateAttack() {
    const password = passwordInput.value;
    if (!password) return;

    attackModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const terminalOutput = document.getElementById('terminalOutput');
    const attemptCountEl = document.getElementById('attemptCount');
    const timeElapsedEl = document.getElementById('timeElapsed');
    const charsCrackedEl = document.getElementById('charsCracked');

    // Reset stats display
    if (attemptCountEl) attemptCountEl.textContent = '0';
    if (timeElapsedEl) timeElapsedEl.textContent = '0.0s';
    if (charsCrackedEl) charsCrackedEl.textContent = '0%';

    // Initial terminal output
    terminalOutput.innerHTML = `
        <div class="text-gray-500">$ initializing security analysis...</div>
        <div class="text-gray-500">$ target: "${password.split('').map(c => c === ' ' ? ' ' : '*').join('')}"</div>
        <div class="text-gray-500">$ length: ${password.length} characters</div>
    `;
    await sleep(400);

    // Analyze password with zxcvbn
    const result = zxcvbn(password);
    terminalOutput.innerHTML += `<div class="text-gray-400">$ strength score: ${result.score}/4 (${result.guesses.toExponential(2)} guesses)</div>`;
    await sleep(300);

    // Detect attack type
    const attackInfo = detectAttackType(password);
    terminalOutput.innerHTML += `<div class="text-cyan-400">$ detected attack type: ${attackInfo.type.toUpperCase()}</div>`;
    terminalOutput.innerHTML += `<div class="text-gray-400">$ reason: ${attackInfo.reason}</div>`;
    terminalOutput.innerHTML += `<div class="text-gray-400">$ confidence: ${Math.round(attackInfo.confidence * 100)}%</div>`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    await sleep(500);

    // Progress update helper
    const updateStats = (percent, attempts, elapsed) => {
        if (attemptCountEl) attemptCountEl.textContent = formatNumber(attempts);
        if (timeElapsedEl) timeElapsedEl.textContent = elapsed + 's';
        if (charsCrackedEl) charsCrackedEl.textContent = Math.floor(percent) + '%';
    };

    // Run the appropriate attack based on detected type
    let attackResult;
    let educationalTips = [];

    switch (attackInfo.type) {
        case 'dictionary':
            terminalOutput.innerHTML += `<div class="text-yellow-400 mt-3">$ launching dictionary attack...</div>`;
            terminalOutput.innerHTML += `<div class="text-gray-400">$ wordlist: top ${commonPasswords.length} common passwords</div>`;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            await sleep(400);
            attackResult = await runDictionaryAttack(password, terminalOutput, updateStats);
            educationalTips.push('Use a unique passphrase, not a common password');
            educationalTips.push('Avoid dictionary words on their own');
            break;

        case 'pattern':
            terminalOutput.innerHTML += `<div class="text-yellow-400 mt-3">$ launching pattern attack...</div>`;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            await sleep(400);
            attackResult = await runPatternAttack(password, terminalOutput, updateStats);

            if (result.sequence.some(s => s.pattern === 'dictionary')) {
                educationalTips.push('Substituting @ for a or 3 for e is a known pattern');
                educationalTips.push('Use random words, not predictable substitutions');
            }
            if (result.sequence.some(s => s.pattern === 'spatial')) {
                educationalTips.push('Keyboard walks like "qwerty" are in every attacker\'s wordlist');
            }
            if (result.sequence.some(s => s.pattern === 'repeat')) {
                educationalTips.push('Repeated characters (aaa) add minimal security');
            }
            if (result.sequence.some(s => s.pattern === 'date')) {
                educationalTips.push('Birth years and dates are easy to find on social media');
            }
            break;

        case 'bruteforce':
        default:
            terminalOutput.innerHTML += `<div class="text-yellow-400 mt-3">$ launching brute force attack...</div>`;
            terminalOutput.innerHTML += `<div class="text-gray-400">$ hash rate: ${formatNumber(attackHardware.gpu)} H/s (RTX 4090)</div>`;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            await sleep(400);
            attackResult = await runBruteForceAttack(password, terminalOutput, updateStats);

            if (result.score >= 3) {
                educationalTips.push('Strong password! Would take ' + formatTime(result.guesses / attackHardware.cloud) + ' to crack on botnet');
            } else if (result.score >= 2) {
                educationalTips.push('Consider a longer passphrase for better protection');
                educationalTips.push('Adding words is more effective than adding symbols');
            } else {
                educationalTips.push('Increase length - each character exponentially increases security');
                educationalTips.push('Use a passphrase: 4+ random words beat short complex passwords');
            }
            break;
    }

    await sleep(500);

    // Final separator
    terminalOutput.innerHTML += `<div class="text-gray-500 mt-4">\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</div>`;

    if (attackResult.success) {
        const crackTime = calculateRealisticCrackTime(password, attackInfo.type);
        terminalOutput.innerHTML += `
            <div class="text-green-400 text-lg mt-3">$ CRACKED!</div>
            <div class="text-gray-400">$ attack type: ${attackInfo.type.toUpperCase()}</div>
            <div class="text-gray-400">$ total attempts: ${formatNumber(attackResult.attempts)}</div>
            <div class="text-gray-400">$ simulated time: ${attackResult.elapsed.toFixed(2)}s</div>
            <div class="text-yellow-400">$ real crack time (RTX 4090): ${formatTime(crackTime)}</div>
        `;
    } else if (attackResult.method === 'not_found') {
        terminalOutput.innerHTML += `
            <div class="text-yellow-400 text-lg mt-3">$ PASSWORD NOT IN WORDLISTS</div>
            <div class="text-gray-400">$ dictionary scan exhausted (${formatNumber(attackResult.attempts)} attempts)</div>
            <div class="text-gray-400">$ falling through to brute force...</div>
        `;
    } else if (attackResult.method === 'pattern_exhausted') {
        terminalOutput.innerHTML += `
            <div class="text-yellow-400 text-lg mt-3">$ PATTERN VARIANTS EXHAUSTED</div>
            <div class="text-gray-400">$ no common pattern match found (${formatNumber(attackResult.attempts)} attempts)</div>
        `;
    } else if (attackResult.method === 'timeout') {
        terminalOutput.innerHTML += `
            <div class="text-yellow-400 text-lg mt-3">$ ATTACK TIMEOUT</div>
            <div class="text-gray-400">$ brute force would need ${formatNumber(attackResult.attempts)}+ attempts</div>
            <div class="text-gray-400">$ (stopped early for performance)</div>
        `;
    } else if (attackResult.method === 'infeasible') {
        terminalOutput.innerHTML += `
            <div class="text-green-400 text-lg mt-3">$ PASSWORD SECURE</div>
            <div class="text-gray-400">$ brute force not economically viable</div>
            <div class="text-gray-400">$ estimated crack time exceeds useful attack window</div>
        `;
    } else {
        terminalOutput.innerHTML += `
            <div class="text-yellow-400 text-lg mt-3">$ PASSWORD NOT CRACKED</div>
            <div class="text-gray-400">$ ${attackResult.method} (${formatNumber(attackResult.attempts)} attempts)</div>
        `;
    }

    // Educational feedback
    terminalOutput.innerHTML += `<div class="text-gray-500 mt-4">\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</div>`;
    terminalOutput.innerHTML += `<div class="text-cyan-400">$ RECOMMENDATIONS:</div>`;

    // Get specific feedback from zxcvbn
    if (result.feedback.suggestions && result.feedback.suggestions.length > 0) {
        result.feedback.suggestions.slice(0, 2).forEach(suggestion => {
            terminalOutput.innerHTML += `<div class="text-gray-400">$ - ${suggestion}</div>`;
        });
    }

    // Add educational tips
    educationalTips.forEach(tip => {
        terminalOutput.innerHTML += `<div class="text-gray-400">$ - ${tip}</div>`;
    });

    // Final stats update
    if (timeElapsedEl) timeElapsedEl.textContent = attackResult.elapsed.toFixed(1) + 's';
    if (charsCrackedEl) charsCrackedEl.textContent = attackResult.success ? '100%' : '99.9%';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// ============ PRIVACY INSPECTOR ============
async function updatePrivacyInspector() {
    const password = passwordInput.value;

    if (!password) {
        privacyPassword.textContent = 'Enter password above';
        privacyHash.textContent = '\u2014';
        privacyPrefix.textContent = '\u2014';
        privacySuffix.textContent = '\u2014';
        privacyApiResponse.textContent = 'Enter password to see API call';
        return;
    }

    const masked = password.substring(0, 2) + '\u2022'.repeat(Math.min(password.length - 4, 6)) + password.substring(password.length - 2);
    privacyPassword.textContent = '"' + masked + '"';

    const hash = await sha1(password);
    privacyHash.textContent = hash;

    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    privacyPrefix.textContent = '"' + prefix + '"';
    privacySuffix.textContent = '"' + suffix + '..."';

    privacyApiResponse.textContent = 'GET /range/' + prefix + ' -> Received ~500 matching hashes';
}

// ============ BREACH CHECK ============
function showKAnonFlow() {
    document.getElementById('kAnonDefault').classList.add('hidden');
    document.getElementById('kAnonFlow').classList.remove('hidden');
    // Auto-scroll to the section
    document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetKAnonFlow() {
    document.getElementById('kAnonDefault').classList.remove('hidden');
    document.getElementById('kAnonFlow').classList.add('hidden');
    // Reset circles
    for (let i = 1; i <= 4; i++) {
        const circle = document.getElementById('circle' + i);
        circle.classList.remove('step-glow-once');
        circle.style.animation = 'none';
        circle.offsetHeight; // trigger reflow
    }
    // Reset flow lines - clear content
    document.getElementById('flowPasswordText').textContent = '';
    document.getElementById('flowLine1').classList.remove('show');
    document.getElementById('arrow1').classList.remove('show');
    document.getElementById('flowHashText').textContent = '';
    document.getElementById('flowLine2').classList.remove('show');
    document.getElementById('arrow2').classList.remove('show');
    document.getElementById('flowSendText').textContent = '';
    document.getElementById('flowKeepText').textContent = '';
    document.getElementById('flowLine3').classList.remove('show');
    document.getElementById('arrow3').classList.remove('show');
    document.getElementById('flowResultText').textContent = '';
    document.getElementById('flowLine4').classList.remove('show');
}

async function typeText(element, text, speed = 20) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await sleep(speed);
    }
}

async function animateStep(stepNum, config) {
    // First glow the step circle
    const circle = document.getElementById('circle' + stepNum);
    circle.style.animation = '';
    circle.classList.add('step-glow-once');

    await sleep(300);

    // Update step visuals
    for (let i = 1; i <= 4; i++) {
        const s = document.getElementById('step' + i);
        if (i < stepNum) {
            s.classList.add('step-complete');
            s.classList.remove('opacity-50');
        } else if (i === stepNum) {
            s.classList.remove('opacity-50');
            s.classList.add('step-complete');
        } else {
            s.classList.add('opacity-50');
            s.classList.remove('step-complete');
        }
    }

    await sleep(300);

    // Reveal content with typing effect based on step
    if (stepNum === 1 && config) {
        const masked = config.password.substring(0, 2) + '\u2022'.repeat(Math.min(config.password.length - 4, 8)) + config.password.substring(config.password.length - 2);
        const fullText = '"' + escapeHtml(masked) + '"';
        document.getElementById('flowLine1').classList.add('show');
        await typeText(document.getElementById('flowPasswordText'), fullText, 30);
        await sleep(150);
        document.getElementById('arrow1').classList.add('show');
    }

    if (stepNum === 2 && config) {
        const fullText = '"' + escapeHtml(config.hash) + '"';
        document.getElementById('flowLine2').classList.add('show');
        await typeText(document.getElementById('flowHashText'), fullText, 8);
        await sleep(150);
        document.getElementById('arrow2').classList.add('show');
    }

    if (stepNum === 3 && config) {
        document.getElementById('flowLine3').classList.add('show');
        await typeText(document.getElementById('flowSendText'), '"' + escapeHtml(config.prefix) + '"', 15);
        await sleep(100);
        await typeText(document.getElementById('flowKeepText'), '"' + escapeHtml(config.suffix) + '"', 5);
        await sleep(150);
        document.getElementById('arrow3').classList.add('show');
    }

    if (stepNum === 4 && config) {
        document.getElementById('flowLine4').classList.add('show');
        if (config.result !== undefined) {
            const resultColor = config.result === 0 ? 'text-green-400' : 'text-red-400';
            const resultText = config.result === 0 ? 'NOT found (safe)' : 'FOUND in ' + config.result.toLocaleString() + ' breaches!';
            await typeText(document.getElementById('flowResultText'), resultText, 40);
            document.getElementById('flowResultText').className = 'ml-2 ' + resultColor;
        }
    }

    // Wait for glow animation to finish
    await sleep(400);
}

async function checkBreach(password) {
    showKAnonFlow();
    showBreachState('loading');

    await animateStep(1, { password: password });

    try {
        const hash = await sha1(password);
        hashPreview.textContent = 'SHA1(' + hash.substring(0, 5) + '......)';

        await animateStep(2, { password: password, hash: hash });

        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5).toUpperCase();

        await animateStep(3, { prefix: prefix, suffix: suffix });

        const response = await fetch('https://api.pwnedpasswords.com/range/' + prefix, {
            headers: { 'Add-Padding': 'true' }
        });

        if (!response.ok) {
            throw new Error('API returned status ' + response.status);
        }

        const responseText = await response.text();
        const lines = responseText.split('\n');
        let foundCount = 0;

        for (const line of lines) {
            const parts = line.split(':');
            const hashSuffix = parts[0].trim().toUpperCase();
            const count = parseInt(parts[1].trim(), 10);
            if (hashSuffix === suffix) {
                foundCount = count;
                break;
            }
        }

        await animateStep(4, { result: foundCount });

        // After step 4, wait 2 seconds then scroll up to dashboard
        await sleep(2000);
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (foundCount > 0) {
            breachCount.textContent = foundCount.toLocaleString();
            showBreachState('found');
        } else {
            showBreachState('safe');
        }

    } catch (error) {
        console.error('Breach check failed:', error);
        errorMessage.textContent = error.message || 'Unable to check breach status';
        showBreachState('error');
    }
}

function showBreachState(state) {
    breachInitial.classList.add('hidden');
    breachLoading.classList.add('hidden');
    breachSafe.classList.add('hidden');
    breachFound.classList.add('hidden');
    breachError.classList.add('hidden');

    switch (state) {
        case 'initial': breachInitial.classList.remove('hidden'); break;
        case 'loading': breachLoading.classList.remove('hidden'); break;
        case 'safe': breachSafe.classList.remove('hidden'); break;
        case 'found': breachFound.classList.remove('hidden'); break;
        case 'error': breachError.classList.remove('hidden'); break;
    }
}

function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.classList.toggle('hidden', !isPassword);
    eyeOffIcon.classList.toggle('hidden', isPassword);
}

// ============ EVENT LISTENERS ============
passwordInput.addEventListener('input', (e) => {
    updateStrengthMeter(e.target.value);
    if (e.target.value) {
        showBreachState('initial');
        updatePrivacyInspector();
    } else {
        showBreachState('initial');
        resetKAnonFlow();
        privacyPassword.textContent = 'Enter password above';
        privacyHash.textContent = '\u2014';
        privacyPrefix.textContent = '\u2014';
        privacySuffix.textContent = '\u2014';
        privacyApiResponse.textContent = 'Enter password to see API call';
    }
});

togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

checkBreachBtn.addEventListener('click', () => {
    const password = passwordInput.value;
    if (password) checkBreach(password);
});

generatePassphraseBtn.addEventListener('click', generatePassphrase);

simulateAttackBtn.addEventListener('click', simulateAttack);

openPrivacyBtn.addEventListener('click', () => {
    updatePrivacyInspector();
    privacyModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

closeAttackModal.addEventListener('click', () => {
    attackModal.classList.add('hidden');
    document.body.style.overflow = '';
});

closePrivacyModal.addEventListener('click', () => {
    privacyModal.classList.add('hidden');
    document.body.style.overflow = '';
});

// Close modals on backdrop click
attackModal.addEventListener('click', (e) => {
    if (e.target === attackModal) {
        attackModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

privacyModal.addEventListener('click', (e) => {
    if (e.target === privacyModal) {
        privacyModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// Close modals on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        attackModal.classList.add('hidden');
        privacyModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    passwordInput.focus();
});
