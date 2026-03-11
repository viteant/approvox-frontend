export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event) as any
  if (!user?.token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:8000/api'

  try {
    return await $fetch(`${baseURL}/admin/team/${id}/reset-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?._data?.message || 'Failed to trigger password reset for team member'
    })
  }
})
