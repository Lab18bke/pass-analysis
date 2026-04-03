<template>
  <div class="minimal-card animate-fade-up" style="animation-delay: 0.1s" ref="cardRef">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-3">
        <span class="text-xs font-medium tracking-widest uppercase" style="color: var(--text-muted)">Strength</span>
        <button
          v-if="isExceptional"
          @click.stop="showEasterEgg = !showEasterEgg"
          class="relative group cursor-pointer"
          style="background: none; border: none; padding: 0;"
        >
          <svg class="w-4 h-4 transition-all duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted)">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/>
          </svg>
          <div
            v-if="showEasterEgg"
            class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-4 rounded-xl text-center animate-scale-in"
            style="background: var(--surface); border: 1px solid var(--border); z-index: 50;"
          >
            <div class="text-sm font-medium mb-2 serif-title" style="font-style: normal;">Remarkable.</div>
            <p class="text-xs leading-relaxed" style="color: var(--text-muted)">
              Your password is exceptionally strong — but no password is truly "perfect." Given enough time and luck, anything can be cracked. Stay vigilant.
            </p>
          </div>
        </button>
      </div>
      <div
        class="minimal-badge"
        :style="{ color: strength.hex, borderColor: strength.hex + '40', background: strength.hex + '10' }"
      >
        {{ strength.label }}
      </div>
    </div>

    <div class="relative h-1 rounded-full overflow-hidden mb-4" style="background: var(--border)">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        :style="{ width: `${score}%`, backgroundColor: strength.hex }"
      />
    </div>

    <div class="flex items-end justify-between">
      <div>
        <div class="text-4xl font-light tabular-nums" :style="{ color: strength.hex }">{{ score }}</div>
        <div class="text-xs mt-1" style="color: var(--text-muted)">out of 100</div>
      </div>
      <div class="text-right">
        <div class="text-lg font-light tabular-nums">{{ entropy }}<span class="text-xs ml-0.5" style="color: var(--text-muted)">bits</span></div>
        <div class="text-xs mt-1" style="color: var(--text-muted)">entropy</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  score: Number,
  strength: Object,
  entropy: Number,
  isExceptional: Boolean,
})

const showEasterEgg = ref(false)
const cardRef = ref(null)

function handleClickOutside(e) {
  if (cardRef.value && !cardRef.value.contains(e.target)) {
    showEasterEgg.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
