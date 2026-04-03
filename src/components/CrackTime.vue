<template>
  <div class="minimal-card animate-fade-up" style="animation-delay: 0.2s">
    <div class="text-xs font-medium tracking-widest uppercase mb-4" style="color: var(--text-muted)">Crack Time</div>
    <div class="grid grid-cols-2 gap-6">
      <div>
        <div class="text-xs mb-1.5" style="color: var(--text-dim)">Brute force</div>
        <div class="text-sm font-medium tabular-nums" :style="{ color: timeColor(bruteForceTime.seconds) }">
          {{ bruteForceTime.value }}
        </div>
      </div>
      <div>
        <div class="text-xs mb-1.5" style="color: var(--text-dim)">Dictionary</div>
        <div class="text-sm font-medium tabular-nums" :style="{ color: dictColor }">
          {{ dictionaryAttack.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bruteForceTime: Object,
  dictionaryAttack: Object,
})

function timeColor(seconds) {
  if (seconds < 1) return '#ff4444'
  if (seconds < 3600) return '#ff8844'
  if (seconds < 86400 * 30) return '#ccaa44'
  if (seconds < 31536000 * 100) return '#44cc88'
  return '#ffffff'
}

const dictColor = computed(() => {
  const risk = props.dictionaryAttack?.risk
  switch (risk) {
    case 'critical': return '#ff4444'
    case 'high': return '#ff8844'
    case 'medium': return '#ccaa44'
    case 'low': return '#44cc88'
    case 'very-low': return '#ffffff'
    default: return 'var(--text-muted)'
  }
})
</script>
