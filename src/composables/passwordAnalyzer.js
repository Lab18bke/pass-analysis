const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'shadow', '123123', '654321', 'superman', 'qazwsx',
  'michael', 'football', 'password1', 'password123', 'admin', 'admin123',
  'root', 'toor', 'pass', 'test', 'guest', 'master123', 'changeme',
  'hello', 'charlie', 'donald', 'batman', 'access', 'thunder', 'matrix',
  'love', 'secret', 'jennifer', 'jordan', 'hunter', 'ranger', 'buster',
  'soccer', 'hockey', 'killer', 'george', 'andrew', 'charlie', 'pepper',
  'summer', 'winter', 'spring', 'autumn', 'fall', 'whatever', 'princess',
  'starwars', 'william', 'daniel', 'rachel', 'jessica', 'thomas', 'robert',
  'welcome', 'login', 'passw0rd', 'hello123', '123456789', '1234567890',
  '0987654321', 'qwerty123', 'pass123', 'qwertyuiop', '111111', '121212',
  '1234', '12345', '1234567890', '1q2w3e4r', '1qaz2wsx', 'zaq1zaq1',
])

const COMMON_PATTERNS = [
  { regex: /^(.)\1+$/, name: 'Single character repeat', severity: 'critical' },
  { regex: /^(012|123|234|345|456|567|678|789|890)+$/i, name: 'Sequential numbers', severity: 'high' },
  { regex: /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i, name: 'Sequential letters', severity: 'high' },
  { regex: /^(qwerty|qwert|asdf|zxcv|wasd)/i, name: 'Keyboard pattern', severity: 'high' },
  { regex: /^[a-z]+[0-9]{1,4}$/i, name: 'Simple word + numbers', severity: 'medium' },
  { regex: /^[A-Z][a-z]+[0-9]{1,4}[!@#$%^&*]?$/, name: 'Capitalized word + numbers', severity: 'medium' },
  { regex: /^(19|20)\d{2}$/, name: 'Year only', severity: 'critical' },
  { regex: /^(0[1-9]|1[0-2])[/\-](19|20)\d{2}$/, name: 'Date pattern', severity: 'high' },
  { regex: /^(.)\1{2,}/, name: 'Repeated characters', severity: 'medium' },
  { regex: /(.+)\1{2,}/, name: 'Repeated sequences', severity: 'high' },
]

function calculateEntropy(password) {
  let poolSize = 0
  if (/[a-z]/.test(password)) poolSize += 26
  if (/[A-Z]/.test(password)) poolSize += 26
  if (/[0-9]/.test(password)) poolSize += 10
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33

  if (poolSize === 0) return 0
  return password.length * Math.log2(poolSize)
}

function detectPatterns(password) {
  const found = []

  for (const pattern of COMMON_PATTERNS) {
    if (pattern.regex.test(password)) {
      found.push({ name: pattern.name, severity: pattern.severity })
    }
  }

  const lower = password.toLowerCase()
  if (COMMON_PASSWORDS.has(lower)) {
    found.push({ name: 'Commonly used password', severity: 'critical' })
  }

  for (const common of COMMON_PASSWORDS) {
    if (common !== lower && lower.includes(common) && common.length >= 4) {
      found.push({ name: `Contains common password "${common}"`, severity: 'high' })
      break
    }
  }

  if (/(.)\1{2,}/.test(password)) {
    const match = password.match(/(.)\1{2,}/)
    found.push({ name: `Triple+ repeat: "${match[0]}"`, severity: 'medium' })
  }

  const sequences = findSequences(password)
  if (sequences.length > 0) {
    found.push({ name: `Sequential characters: "${sequences.join('", "')}"`, severity: 'medium' })
  }

  return found
}

function findSequences(password) {
  const sequences = []
  const keyboardRows = [
    'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
    '1234567890', 'abcdefghijklmnopqrstuvwxyz'
  ]

  for (let i = 0; i < password.length - 2; i++) {
    const sub = password.substring(i, i + 3).toLowerCase()
    for (const row of keyboardRows) {
      if (row.includes(sub)) {
        sequences.push(sub)
        break
      }
    }
  }

  return sequences
}

function estimateBruteForceTime(entropy) {
  const guessesPerSecond = 1e10
  const totalGuesses = Math.pow(2, entropy)
  const seconds = totalGuesses / guessesPerSecond / 2

  if (seconds < 0.001) return { value: 'Instantly', seconds }
  if (seconds < 1) return { value: 'Less than a second', seconds }
  if (seconds < 60) return { value: `${Math.round(seconds)} seconds`, seconds }
  if (seconds < 3600) return { value: `${Math.round(seconds / 60)} minutes`, seconds }
  if (seconds < 86400) return { value: `${Math.round(seconds / 3600)} hours`, seconds }
  if (seconds < 31536000) return { value: `${Math.round(seconds / 86400)} days`, seconds }
  if (seconds < 31536000 * 1000) return { value: `${Math.round(seconds / 31536000)} years`, seconds }
  if (seconds < 31536000 * 1e6) return { value: `${Math.round(seconds / 31536000 / 1000)}K years`, seconds }
  if (seconds < 31536000 * 1e9) return { value: `${Math.round(seconds / 31536000 / 1e6)}M years`, seconds }
  return { value: 'Centuries+', seconds }
}

function estimateDictionaryAttackTime(password) {
  const lower = password.toLowerCase()
  const hasCommonWord = [...COMMON_PASSWORDS].some(p => lower.includes(p) && p.length >= 4)
  const isCommon = COMMON_PASSWORDS.has(lower)

  if (isCommon) return { value: 'Instantly', risk: 'critical' }
  if (hasCommonWord) return { value: 'Seconds to minutes', risk: 'high' }

  const patterns = detectPatterns(password)
  const patternRisk = patterns.some(p => p.severity === 'high' || p.severity === 'critical')
  if (patternRisk) return { value: 'Minutes to hours', risk: 'high' }

  const entropy = calculateEntropy(password)
  if (entropy < 30) return { value: 'Hours to days', risk: 'medium' }
  if (entropy < 50) return { value: 'Days to months', risk: 'medium' }
  if (entropy < 70) return { value: 'Years to decades', risk: 'low' }
  return { value: 'Centuries+', risk: 'very-low' }
}

function getCharComposition(password) {
  return {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
    length: password.length,
  }
}

function calculateStrengthScore(password) {
  let score = 0
  const length = password.length

  if (length < 8) return 0

  score += Math.min(length * 2.5, 40)

  const comp = getCharComposition(password)
  const charTypes = [comp.lowercase, comp.uppercase, comp.numbers, comp.special].filter(Boolean).length
  score += charTypes * 6

  const entropy = calculateEntropy(password)
  score += Math.min(entropy * 0.7, 45)

  const uniqueRatio = new Set(password).size / length
  score += uniqueRatio * 15

  const patterns = detectPatterns(password)
  const patternPenalty = patterns.reduce((sum, p) => {
    switch (p.severity) {
      case 'critical': return sum + 20
      case 'high': return sum + 12
      case 'medium': return sum + 6
      default: return sum + 3
    }
  }, 0)
  score -= patternPenalty

  return Math.max(0, Math.min(100, Math.round(score)))
}

function getStrengthLevel(score) {
  if (score === 0) return { label: 'Invalid', color: 'text-gray-500', bg: 'bg-gray-500', hex: '#6b7280' }
  if (score < 25) return { label: 'Very Weak', color: 'text-red-500', bg: 'bg-red-500', hex: '#ef4444' }
  if (score < 45) return { label: 'Weak', color: 'text-orange-500', bg: 'bg-orange-500', hex: '#f97316' }
  if (score < 65) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500', hex: '#eab308' }
  if (score < 85) return { label: 'Strong', color: 'text-emerald-500', bg: 'bg-emerald-500', hex: '#10b981' }
  if (score < 95) return { label: 'Excellent', color: 'text-cyan-400', bg: 'bg-cyan-400', hex: '#22d3ee' }
  return { label: 'Exceptional', color: 'text-white', bg: 'bg-white', hex: '#ffffff' }
}

export function analyzePassword(password) {
  if (!password || password.includes(' ') || password.length < 8) {
    return {
      score: 0,
      strength: getStrengthLevel(0),
      entropy: password ? calculateEntropy(password) : 0,
      bruteForceTime: { value: 'N/A', seconds: 0 },
      dictionaryAttack: { value: 'N/A', risk: 'critical' },
      composition: getCharComposition(password || ''),
      patterns: password ? detectPatterns(password) : [],
      weaknesses: ['Password must be at least 8 characters'],
      recommendations: [],
    }
  }

  const score = calculateStrengthScore(password)
  const strength = getStrengthLevel(score)
  const entropy = calculateEntropy(password)
  const patterns = detectPatterns(password)
  const bruteForceTime = estimateBruteForceTime(entropy)
  const dictionaryAttack = estimateDictionaryAttackTime(password)

  const weaknesses = []
  const recommendations = []

  if (password.length < 12) weaknesses.push('Short length reduces resistance')
  if (!/[A-Z]/.test(password)) weaknesses.push('No uppercase letters')
  if (!/[a-z]/.test(password)) weaknesses.push('No lowercase letters')
  if (!/[0-9]/.test(password)) weaknesses.push('No numbers')
  if (!/[^a-zA-Z0-9]/.test(password)) weaknesses.push('No special characters')

  for (const p of patterns) {
    weaknesses.push(p.name)
  }

  if (entropy < 40) recommendations.push('Add more character variety to increase entropy')
  if (password.length < 16) recommendations.push('Consider extending to 16+ characters')
  if (!/[^a-zA-Z0-9]/.test(password)) recommendations.push('Include special characters (!@#$%^&*)')
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) recommendations.push('Mix uppercase and lowercase letters')

  return {
    score,
    strength,
    entropy: Math.round(entropy * 100) / 100,
    bruteForceTime,
    dictionaryAttack,
    composition: getCharComposition(password),
    patterns,
    weaknesses,
    recommendations,
    isExceptional: score >= 90,
  }
}
