<template>
  <div v-if="patterns.length > 0 || weaknesses.length > 0" class="minimal-card animate-fade-up" style="animation-delay: 0.25s">
    <div class="text-xs font-medium tracking-widest uppercase mb-4" style="color: var(--text-muted)">Weaknesses</div>
    <div class="space-y-2.5">
      <div
        v-for="(pattern, index) in patterns"
        :key="'p' + index"
        class="flex items-start gap-3 animate-slide-in"
        :style="{ animationDelay: `${index * 0.04}s` }"
      >
        <div class="w-1 h-1 rounded-full mt-2 flex-shrink-0" :style="{ backgroundColor: severityColor(pattern.severity) }" />
        <div>
          <span class="text-sm" :style="{ color: severityColor(pattern.severity) }">{{ pattern.name }}</span>
        </div>
      </div>
      <div
        v-for="(w, index) in weaknesses"
        :key="'w' + index"
        class="flex items-start gap-3 animate-slide-in"
        :style="{ animationDelay: `${(patterns.length + index) * 0.04}s` }"
      >
        <div class="w-1 h-1 rounded-full mt-2 flex-shrink-0" style="background-color: #ff4444" />
        <span class="text-sm" style="color: var(--text-muted)">{{ w }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  patterns: Array,
  weaknesses: Array,
})

function severityColor(severity) {
  switch (severity) {
    case 'critical': return '#ff4444'
    case 'high': return '#ff8844'
    case 'medium': return '#ccaa44'
    default: return 'var(--text-muted)'
  }
}
</script>
