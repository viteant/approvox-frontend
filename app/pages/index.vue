<template>
    <div class="space-y-12">
    <header class="mb-8 sm:mb-10">
      <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
        {{ $t('welcome') }}
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">
        {{ $t('stats.title') }} - Overview of your project efficiency.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <StatWidget
        :label="$t('stats.users')"
        value="1,234"
        icon="i-lucide-users-2"
        :trend="12"
      />
      <StatWidget
        :label="$t('stats.projects')"
        value="48"
        icon="i-lucide-folder-tree"
        :trend="5"
      />
      <StatWidget
        :label="$t('stats.revenue')"
        value="$128,430"
        icon="i-lucide-wallet-2"
        :trend="-2"
      />
    </div>

    <div 
      class="rounded-[32px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-800/60 p-6 sm:p-10 shadow-sm"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-xl font-black tracking-tight font-['Outfit']">Recent Activities</h2>
          <p class="text-xs text-slate-500 font-medium mt-1">Monitor the latest system changes and project updates.</p>
        </div>
        <UButton color="neutral" variant="subtle" class="rounded-[20px] font-bold px-6 h-12">View All</UButton>
      </div>

      <div class="space-y-3">
        <div v-for="i in 3" :key="i" class="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-[24px] hover:bg-white/40 dark:hover:bg-slate-800/40 border border-transparent hover:border-white/60 transition-all duration-300 group">
          <div class="w-12 h-12 flex-shrink-0 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-sm">
            <UIcon name="i-lucide-sparkles" class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <h4 class="font-black text-base tracking-tight">System Node Update #{{ i }}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Successfully synchronized backend clusters with the new core logic.</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 font-black uppercase tracking-widest">2h ago</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script>
