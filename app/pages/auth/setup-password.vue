<template>
  <div class="min-h-screen flex items-center justify-center bg-azure-white dark:bg-deep-navy transition-colors duration-500 overflow-hidden relative">
    <!-- Floating Switchers -->
    <div class="fixed top-8 right-8 flex items-center gap-4 z-50">
      <ULocaleSelect
        v-model="currentLocale"
        :locales="[locales.en, locales.es]"
        class="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/40 shadow-sm rounded-xl"
      />

      <UButton
        color="neutral"
        variant="ghost"
        class="rounded-xl p-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/40 shadow-sm"
        @click="toggleTheme"
      >
        <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="w-5 h-5" />
      </UButton>

      <UButton
        color="error"
        variant="ghost"
        class="rounded-xl p-2 bg-red-400/10 dark:bg-red-900/20 backdrop-blur-md border border-red-400/20 dark:border-red-800/20 shadow-sm"
        @click="logout"
      >
        <UIcon name="i-lucide-log-out" class="w-5 h-5" />
      </UButton>
    </div>

    <!-- Abstract Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        v-motion
        :initial="{ x: -100, y: -100, scale: 1, opacity: 0 }"
        :enter="{ 
          opacity: 0.4, 
          scale: 1.2,
          x: 0,
          y: 0,
          transition: { duration: 2000, type: 'tween', ease: 'easeOut' } 
        }"
        class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px]"
      />
      <div
        v-motion
        :initial="{ x: 100, y: 100, scale: 1, opacity: 0 }"
        :enter="{ 
          opacity: 0.3, 
          scale: 1.5,
          x: 0,
          y: 0,
          transition: { duration: 2500, type: 'tween', ease: 'easeOut', delay: 200 } 
        }"
        class="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[120px]"
      />
      <div
        v-motion
        :initial="{ scale: 0.8, opacity: 0 }"
        :enter="{ 
          opacity: 0.2, 
          scale: 1.1,
          transition: { duration: 3000, type: 'tween', ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' } 
        }"
        class="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-[80px]"
      />
    </div>

    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.9, y: 20 }"
      :enter="{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } }"
      class="w-full max-w-md px-6 z-10"
    >
      <UCard
        class="overflow-visible backdrop-blur-2xl ring-0 border-white/40 dark:border-blue-900/30"
        :ui="{
          body: 'p-8 md:p-10'
        }"
      >
        <div class="text-center mb-10">
          <div class="inline-flex p-4 rounded-3xl bg-blue-50 dark:bg-blue-900/30 mb-6 shadow-sm">
            <UIcon name="i-lucide-shield-alert" class="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ $t('auth.setup_password_title') }}
          </h1>
          <p class="mt-3 text-slate-500 dark:text-slate-400 font-medium">
            {{ $t('auth.setup_password_subtitle') }}
          </p>
        </div>

        <UForm :state="state" :schema="schema" class="space-y-6" @submit="handleSubmit">
          <UFormField :label="$t('auth.current_password')" name="current_password" required>
            <UInput
              v-model="state.current_password"
              :type="showCurrentPassword ? 'text' : 'password'"
              icon="i-lucide-lock"
              placeholder="••••••••"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  :icon="showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  class="mr-1"
                  @click="showCurrentPassword = !showCurrentPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <UFormField :label="$t('auth.new_password')" name="new_password" required>
            <UInput
              v-model="state.new_password"
              :type="showNewPassword ? 'text' : 'password'"
              icon="i-lucide-shield-check"
              placeholder="••••••••"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  class="mr-1"
                  @click="showNewPassword = !showNewPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <UFormField :label="$t('auth.confirm_password')" name="confirm_password" required>
            <UInput
              v-model="state.confirm_password"
              :type="showConfirmPassword ? 'text' : 'password'"
              icon="i-lucide-check-circle-2"
              placeholder="••••••••"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  class="mr-1"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <UButton
            type="submit"
            block
            size="xl"
            class="h-14 text-lg font-bold"
            :loading="loading"
          >
            {{ loading ? $t('auth.updating_password') : $t('auth.update_password_button') }}
          </UButton>
        </UForm>

        <div class="mt-8 text-center">
          <p class="text-sm text-slate-400 font-medium">
            &copy; {{ new Date().getFullYear() }} Approvox Analytics.
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import * as locales from '@nuxt/ui/locale'

definePageMeta({
  layout: false,
  middleware: 'auth'
})

const { updateInitialPassword, logout } = useAppAuth()
const { locale, setLocale, t } = useI18n()
const currentLocale = computed({
  get: () => locale.value,
  set: (value) => setLocale(value as 'en' | 'es')
})
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const loading = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const state = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const schema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
  confirm_password: z.string().min(8)
}).refine((data) => data.new_password === data.confirm_password, {
  message: t('auth.password_mismatch'),
  path: ['confirm_password']
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await updateInitialPassword(state)
  } catch (err) {
    // Error handled by composable
  } finally {
    loading.value = false
  }
}
</script>
