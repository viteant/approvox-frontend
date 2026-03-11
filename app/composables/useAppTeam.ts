export const useAppTeam = () => {
  const team = ref<any[]>([])
  const loading = ref(false)
  const totalItems = ref(0)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const toast = useToast()
  const { t } = useI18n()

  const fetchTeam = async (params: Record<string, any> = {}) => {
    loading.value = true
    try {
      const response = await $fetch<{ data: any[], meta: any }>('/api/admin/team', { query: params })
      team.value = response.data
      if (response.meta) {
        totalItems.value = response.meta.total ?? 0
        currentPage.value = response.meta.current_page ?? 1
        lastPage.value = response.meta.last_page ?? 1
      }
    } catch (error: any) {
      toast.add({
        title: t('auth.unknown_error'),
        color: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  const addMember = async (memberData: any) => {
    loading.value = true
    try {
      const response = await $fetch<{ data: any }>('/api/admin/team', {
        method: 'POST',
        body: memberData
      })
      const newMember = response.data
      team.value.push(newMember)
      toast.add({
        title: t('team.success_add'),
        color: 'success'
      })
      return newMember
    } catch (error: any) {
      toast.add({
        title: error.data?.statusMessage || t('auth.unknown_error'),
        color: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateMember = async (id: number | string, memberData: any) => {
    loading.value = true
    try {
      const response = await $fetch<{ data: any }>(`/api/admin/team/${id}`, {
        method: 'PUT',
        body: memberData
      })
      const updatedMember = response.data
      const index = team.value.findIndex(m => m.id === id)
      if (index !== -1) {
        team.value[index] = updatedMember
      }
      toast.add({
        title: t('team.success_update'),
        color: 'success'
      })
      return updatedMember
    } catch (error: any) {
      toast.add({
        title: error.data?.statusMessage || t('auth.unknown_error'),
        color: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const offboardMember = async (id: number | string) => {
    loading.value = true
    try {
      await $fetch(`/api/admin/team/${id}`, {
        method: 'DELETE'
      })
      team.value = team.value.filter(m => m.id !== id)
      toast.add({
        title: t('team.success_offboard'),
        color: 'success'
      })
    } catch (error: any) {
      const message = error.status === 422 
        ? t('team.offboard_error_logs') 
        : (error.data?.statusMessage || t('auth.unknown_error'))
      
      toast.add({
        title: message,
        color: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (id: number | string) => {
    loading.value = true
    try {
      await $fetch(`/api/admin/team/${id}/reset-password`, {
        method: 'POST'
      })
      toast.add({
        title: t('team.success_reset_password') || 'Password reset successfully',
        color: 'success'
      })
    } catch (error: any) {
      toast.add({
        title: error.data?.statusMessage || t('auth.unknown_error'),
        color: 'error'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    team,
    loading,
    totalItems,
    currentPage,
    lastPage,
    fetchTeam,
    addMember,
    updateMember,
    offboardMember,
    resetPassword
  }
}
