<template>
  <div class="minimal-card animate-fade-up" style="animation-delay: 0.15s">
    <div class="text-xs font-medium tracking-widest uppercase mb-4" style="color: var(--text-muted)">Composition</div>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="item in charTypes"
        :key="item.label"
        class="px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-300"
        :style="item.active
          ? { background: 'rgba(255,255,255,0.08)', color: 'var(--text)', border: '1px solid var(--border-hover)' }
          : { background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border)' }"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  composition: Object,
})

const charTypes = computed(() => [
  { label: 'a-z', active: props.composition?.lowercase },
  { label: 'A-Z', active: props.composition?.uppercase },
  { label: '0-9', active: props.composition?.numbers },
  { label: '!@#$', active: props.composition?.special },
])
</script>
