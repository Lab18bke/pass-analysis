import { analyzePassword } from './passwordAnalyzer.js'

const SPECIAL_CHARS = '@!$#'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'

function pick(str) {
  return str[Math.floor(Math.random() * str.length)]
}

function shuffle(str) {
  const arr = str.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

function generateCandidate(length) {
  const specials = Math.max(3, Math.floor(length * 0.25))
  const uppers = Math.max(2, Math.floor(length * 0.2))
  const digits = Math.max(2, Math.floor(length * 0.15))
  const lowers = length - specials - uppers - digits

  let password = ''
  for (let i = 0; i < lowers; i++) password += pick(LOWER)
  for (let i = 0; i < uppers; i++) password += pick(UPPER)
  for (let i = 0; i < digits; i++) password += pick(DIGITS)
  for (let i = 0; i < specials; i++) password += pick(SPECIAL_CHARS)

  return shuffle(password)
}

export function generateStrongPassword() {
  for (let attempt = 0; attempt < 200; attempt++) {
    const length = 22 + Math.floor(Math.random() * 6)
    const candidate = generateCandidate(length)
    const result = analyzePassword(candidate)
    if (result.score >= 95) return candidate
  }

  const fallback = generateCandidate(26)
  return fallback
}
