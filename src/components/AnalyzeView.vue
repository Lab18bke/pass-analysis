<template>
  <div>
    <div class="mt-8 mb-10 flex flex-col items-center">
      <PasswordInput v-model="password" />
    </div>

    <template v-if="password.length >= 8">
      <div class="space-y-4">
        <StrengthMeter
          :score="analysis.score"
          :strength="analysis.strength"
          :entropy="analysis.entropy"
          :is-exceptional="analysis.isExceptional"
        />

        <CharacterComposition :composition="analysis.composition" />

        <CrackTime
          :brute-force-time="analysis.bruteForceTime"
          :dictionary-attack="analysis.dictionaryAttack"
        />

        <Weaknesses
          :patterns="analysis.patterns"
          :weaknesses="analysis.weaknesses"
        />

        <Recommendations :recommendations="analysis.recommendations" />
      </div>
    </template>

    <div v-else-if="password.length > 0" class="text-center py-8 animate-fade-in">
      <p class="text-sm" style="color: var(--text-muted)">Minimum 8 characters required</p>
    </div>

    <footer class="mt-20 text-center animate-fade-in">
      <p class="text-xs" style="color: var(--text-dim)">Analysis performed locally. Nothing is stored or transmitted.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { analyzePassword } from '../composables/passwordAnalyzer.js'
import PasswordInput from './PasswordInput.vue'
import StrengthMeter from './StrengthMeter.vue'
import CharacterComposition from './CharacterComposition.vue'
import CrackTime from './CrackTime.vue'
import Weaknesses from './Weaknesses.vue'
import Recommendations from './Recommendations.vue'

const password = ref('')

const analysis = computed(() => {
  if (!password.value) return null
  return analyzePassword(password.value)
})
</script>
