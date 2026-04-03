<template>
  <div class="relative w-full flex justify-center">
    <div class="relative w-full" style="max-width: 480px">
      <input
        :type="showPassword ? 'text' : 'password'"
        v-model="inputValue"
        @input="handleInput"
        placeholder="enter password..."
        class="minimal-input w-full"
        autocomplete="off"
        spellcheck="false"
        maxlength="32"
      />
      <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <button
          @click="showPassword = !showPassword"
          class="p-1.5 rounded-md transition-colors duration-200"
          :style="{ color: showPassword ? 'var(--text)' : 'var(--text-muted)' }"
          @mouseenter="$event.currentTarget.style.color = 'var(--text)'"
          @mouseleave="$event.currentTarget.style.color = showPassword ? 'var(--text)' : 'var(--text-muted)'"
        >
          <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.173 5.14M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
        <button
          v-if="inputValue"
          @click="clearInput"
          class="p-1.5 rounded-md transition-colors duration-200"
          style="color: var(--text-muted)"
          @mouseenter="$event.currentTarget.style.color = '#ff4444'"
          @mouseleave="$event.currentTarget.style.color = 'var(--text-muted)'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="absolute -bottom-5 left-1/2 -translate-x-1/2">
      <span class="text-xs font-light tracking-wider" style="color: var(--text-dim)">{{ inputValue.length }}/32</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: String,
  strengthHex: String,
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref('')
const showPassword = ref(false)

function handleInput(e) {
  const val = e.target.value
  if (val.includes(' ')) {
    e.target.value = inputValue.value
    return
  }
  emit('update:modelValue', val)
}

function clearInput() {
  inputValue.value = ''
  emit('update:modelValue', '')
}
</script>
