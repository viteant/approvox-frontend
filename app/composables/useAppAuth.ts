export const useAppAuth = () => {
  const { fetch: fetchSession, loggedIn, user, clear } = useUserSession()
  const toast = useToast()
  const router = useRouter()
  const { t } = useI18n()
  const localePath = useLocalePath()

  const login = async (credentials: any) => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      await fetchSession()
      
      toast.add({
        title: t('auth.login_success') || 'Welcome back!',
        color: 'success'
      })

      // Proactive redirection if password change is required
      if (user.value?.must_change_password) {
        router.push(localePath('/auth/setup-password'))
      } else {
        router.push(localePath('/'))
      }
    } catch (error: any) {
      toast.add({
        title: error.data?.statusMessage || t('auth.invalid_credentials'),
        color: 'error'
      })
      throw error
    }
  }

  const logout = async () => {
    await clear()
    router.push(localePath('/login'))
    toast.add({
      title: t('auth.logout_success') || 'Logged out successfully',
      color: 'neutral'
    })
  }

  const updateInitialPassword = async (data: any) => {
    try {
      await $fetch('/api/auth/password-update', {
        method: 'POST',
        body: data
      })

      await fetchSession()

      toast.add({
        title: t('auth.setup_success') || 'Password updated successfully!',
        color: 'success'
      })

      router.push(localePath('/'))
    } catch (error: any) {
      toast.add({
        title: error.data?.statusMessage || t('auth.unknown_error'),
        color: 'error'
      })
      throw error
    }
  }

  return {
    login,
    logout,
    updateInitialPassword,
    loggedIn,
    user
  }
}
