<template>
  <div class="mt-12">
    <div class="text-center mb-10">
      <p class="text-sm" style="color: var(--text-muted)">Generate a cryptographically strong password</p>
    </div>

    <div class="minimal-card animate-fade-up">
      <div class="text-xs font-medium tracking-widest uppercase mb-6" style="color: var(--text-muted)">Generated Password</div>

      <div v-if="generatedPassword" class="relative">
        <div
          class="p-4 rounded-xl text-center font-mono text-lg tracking-widest break-all cursor-pointer transition-colors duration-200"
          style="background: var(--bg); border: 1px solid var(--border);"
          @click="copyPassword"
          :title="'Click to copy'"
        >
          {{ generatedPassword }}
        </div>

        <div class="flex items-center justify-between mt-4">
          <div class="text-xs" style="color: var(--text-dim)">{{ generatedPassword.length }} characters</div>
          <button
            @click="copyPassword"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            :style="copied
              ? { background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981' }
              : { background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }"
            @mouseenter="$event.currentTarget.style.borderColor = '#2a2a2a'"
            @mouseleave="$event.currentTarget.style.borderColor = 'var(--border)'"
          >
            <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-sm" style="color: var(--text-dim)">Click generate to create a strong password</p>
      </div>

      <button
        @click="generate"
        class="w-full mt-6 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200"
        style="background: var(--text); color: var(--bg);"
        @mouseenter="$event.currentTarget.style.opacity = '0.85'"
        @mouseleave="$event.currentTarget.style.opacity = '1'"
      >
        Generate
      </button>
    </div>

    <div v-if="generatedPassword" class="minimal-card animate-fade-up mt-4" style="animation-delay: 0.1s">
      <StrengthMeter
        :score="analysis.score"
        :strength="analysis.strength"
        :entropy="analysis.entropy"
        :is-exceptional="analysis.isExceptional"
      />
    </div>

    <footer class="mt-20 text-center animate-fade-in">
      <p class="text-xs" style="color: var(--text-dim)">Generated locally. Never stored or transmitted.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { generateStrongPassword } from '../composables/passwordGenerator.js'
import { analyzePassword } from '../composables/passwordAnalyzer.js'
import StrengthMeter from './StrengthMeter.vue'

const generatedPassword = ref('')
const copied = ref(false)

const analysis = computed(() => {
  if (!generatedPassword.value) return null
  return analyzePassword(generatedPassword.value)
})

function generate() {
  generatedPassword.value = generateStrongPassword()
  copied.value = false
}

async function copyPassword() {
  if (!generatedPassword.value) return
  try {
    await navigator.clipboard.writeText(generatedPassword.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = generatedPassword.value
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>
