export const useAppClients = () => {
  const clients = ref<any[]>([])
  const loading = ref(false)
  const totalItems = ref(0)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const toast = useToast()
  const { t } = useI18n()

  const fetchClients = async (params: Record<string, any> = {}) => {
    loading.value = true
    try {
      const response = await $fetch<{ data: any[], meta: any }>('/api/admin/clients', { query: params })
      clients.value = response.data
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

  const createClient = async (clientData: any) => {
    loading.value = true
    try {
      const response = await $fetch<{ data: any }>('/api/admin/clients', {
        method: 'POST',
        body: clientData
      })
      const newClient = response.data
      clients.value.push(newClient)
      toast.add({
        title: t('clients.success_create'),
        color: 'success'
      })
      return newClient
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

  const deactivateClient = async (id: number | string) => {
    loading.value = true
    try {
      await $fetch(`/api/admin/clients/${id}`, {
        method: 'DELETE'
      })
      
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index].status = 'inactive'
      }
      
      toast.add({
        title: t('clients.success_deactivate'),
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

  const updateClient = async (id: number | string, clientData: any) => {
    loading.value = true
    try {
      const response = await $fetch<{ data: any }>(`/api/admin/clients/${id}`, {
        method: 'PUT',
        body: clientData
      })
      const updatedClient = response.data
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index] = { ...clients.value[index], ...updatedClient }
      }
      toast.add({
        title: t('clients.success_update') || 'Client updated successfully',
        color: 'success'
      })
      return updatedClient
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

  const resetPassword = async (id: number | string) => {
    loading.value = true
    try {
      await $fetch(`/api/admin/clients/${id}/reset-password`, {
        method: 'POST'
      })
      toast.add({
        title: t('clients.success_reset_password') || 'Password reset successfully',
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
    clients,
    loading,
    totalItems,
    currentPage,
    lastPage,
    fetchClients,
    createClient,
    updateClient,
    deactivateClient,
    resetPassword
  }
}
