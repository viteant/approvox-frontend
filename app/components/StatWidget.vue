<template>
  <div
    class="p-6 rounded-[28px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-lg group relative overflow-hidden"
  >
    <div class="flex items-center gap-5">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
        <UIcon :name="icon" class="w-7 h-7" />
      </div>
      <div>
        <p class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{{ label }}</p>
        <div class="flex items-baseline gap-2">
          <p class="text-2xl font-black text-slate-800 dark:text-white leading-tight">{{ value }}</p>
          <p v-if="trend" class="text-xs font-bold" :class="trend > 0 ? 'text-emerald-500' : 'text-rose-500'">
            {{ trend > 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}%
          </p>
        </div>
      </div>
    </div>
    
    <!-- Decorative background glow -->
    <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-400/10 transition-colors" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  trend?: number
}>()
</script>
