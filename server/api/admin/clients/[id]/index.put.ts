export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event) as any
  if (!user?.token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:8000/api'

  try {
    return await $fetch(`${baseURL}/admin/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?._data?.message || 'Failed to update client',
      data: error.response?._data?.errors
    })
  }
})
