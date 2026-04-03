<template>
  <div v-if="recommendations.length > 0" class="minimal-card animate-fade-up" style="animation-delay: 0.3s">
    <div class="text-xs font-medium tracking-widest uppercase mb-4" style="color: var(--text-muted)">Suggestions</div>
    <div class="space-y-2.5">
      <div
        v-for="(rec, index) in recommendations"
        :key="index"
        class="flex items-start gap-3 animate-slide-in"
        :style="{ animationDelay: `${index * 0.04}s` }"
      >
        <div class="w-1 h-1 rounded-full mt-2 flex-shrink-0" style="background-color: var(--text-muted)" />
        <span class="text-sm" style="color: var(--text-muted)">{{ rec }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  recommendations: Array,
})
</script>
