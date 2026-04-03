<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-16">
    <div class="w-full max-w-lg animate-fade-up">
      <div class="flex items-center justify-between mb-2">
        <Header />
        <button
          @click="toggleView"
          class="px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-200"
          :style="view === 'analyze'
            ? { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }
            : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }"
          @mouseenter="$event.currentTarget.style.borderColor = '#2a2a2a'"
          @mouseleave="$event.currentTarget.style.borderColor = 'var(--border)'"
        >
          {{ view === 'analyze' ? 'Generate' : 'Analyze' }}
        </button>
      </div>

      <AnalyzeView v-if="view === 'analyze'" />
      <GenerateView v-else />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import AnalyzeView from './components/AnalyzeView.vue'
import GenerateView from './components/GenerateView.vue'

const view = ref('analyze')

function toggleView() {
  view.value = view.value === 'analyze' ? 'generate' : 'analyze'
}
</script>
