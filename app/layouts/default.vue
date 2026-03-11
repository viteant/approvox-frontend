<template>
  <div class="relative min-h-screen">
    <AppBackground />
    <!-- Dynamic Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-400/5 blur-[120px] rounded-full"></div>
    </div>

    <!-- Mobile Overlay -->
    <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
        @click="isSidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside class="fixed inset-y-6 left-6 w-64 bg-azure-50/10 dark:bg-slate-900/70 backdrop-blur-3xl border border-azure-300/10
                dark:border-slate-800/40 rounded-[32px] z-50 flex flex-col p-6 shadow-sm transition-all
                duration-500 lg:translate-x-0"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'"
    >
      <!-- Brand -->
      <div class="flex items-center gap-3 mb-8">
        <div
            class="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <UIcon name="i-lucide-stars" class="text-white w-5 h-5"/>
        </div>
        <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Servana</span>
      </div>

      <!-- User Profile Card -->
      <div class="mb-8 p-3 rounded-lg bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/60">
        <div class="flex items-center gap-3">
          <UAvatar
              src="https://github.com/benjamincanac.png"
              size="md"
              class="ring-2 ring-blue-500/10"
          />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold truncate text-slate-900 dark:text-white">{{ user?.name || 'User Name' }}</p>
            <p class="text-[10px] text-slate-500 truncate">{{ user?.email || 'user@example.com' }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-3">Main Menu</p>
        <nav class="space-y-1">
          <ULink
              v-for="item in navItems"
              :key="item.label"
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 group relative overflow-hidden"
              active-class="bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              @click="isSidebarOpen = false"
          >
            <UIcon :name="item.icon" class="w-5 h-5 z-10"/>
            <span class="font-bold text-[13px] tracking-tight z-10">{{ item.label }}</span>
            <div
                class="absolute inset-0 bg-slate-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </ULink>
        </nav>
      </div>

      <!-- Logout -->
      <div class="mt-6">
        <UButton
            color="neutral"
            variant="subtle"
            size="md"
            class="w-full justify-start rounded-md font-bold"
            icon="i-lucide-log-out"
            @click="logout"
        >
          {{ $t('logout') || 'Logout' }}
        </UButton>
      </div>
    </aside>

    <!-- Main Content wrapper -->
    <div class="transition-all duration-500 lg:pl-70">
      <!-- Global Header -->
      <header class="bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm border border-white/40 dark:border-slate-800/40
                       shadow-sm lg:pr-4 px-4 flex items-center justify-between mb-6 py-2 sticky top-0 z-40 lg:-ml-70 lg:!pl-77">
        <div class="flex items-center gap-4">
          <UButton
              variant="ghost"
              color="neutral"
              size="md"
              class="lg:hidden rounded-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 dark:border-slate-800/60"
              icon="i-lucide-menu"
              @click="isSidebarOpen = true"
          />

          <div class="hidden sm:block relative group w-64 lg:w-80">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UIcon name="i-lucide-search" class="text-slate-400 group-focus-within:text-blue-500 w-4 h-4"/>
            </div>
            <input
                type="text"
                class="block w-full pl-10 pr-4 py-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 dark:border-slate-800/60 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                placeholder="Search everything..."
            >
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <ULocaleSelect
              v-model="currentLocale"
              :locales="[locales.en, locales.es]"
              class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 shadow-sm rounded-md text-xs"
          />

          <UButton
              color="neutral"
              variant="ghost"
              size="md"
              class="rounded-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 shadow-sm transition-transform active:scale-90"
              @click="toggleTheme"
          >
            <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="w-4 h-4"/>
          </UButton>

          <UButton
              color="neutral"
              variant="ghost"
              size="md"
              class="rounded-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 shadow-sm"
              icon="i-lucide-bell"
          />
        </div>
      </header>

      <!-- Content Pane -->
      <main class="max-w-7xl mx-auto pb-12  px-4 sm:px-8">
        <slot/>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const {logout, user} = useAppAuth()
const {locale, setLocale} = useI18n()
const isSidebarOpen = ref(false)

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => setLocale(value as 'en' | 'es')
})
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const navItems = [
  {label: 'Dashboard', icon: 'i-lucide-layout-grid', to: '/'},
  {label: 'Projects', icon: 'i-lucide-folder-kanban', to: '/projects'},
  {label: 'Teams', icon: 'i-lucide-users-round', to: '/admin/team'},
  {label: 'Clients', icon: 'i-lucide-contact-2', to: '/admin/clients'},
  {label: 'Settings', icon: 'i-lucide-settings-2', to: '/settings'},
]
</script>
