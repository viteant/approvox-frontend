import { H3Event } from 'h3'

export const useBackendApi = async (event: H3Event) => {
  const config = useRuntimeConfig()
  const { user, session } = await getUserSession(event)
  
  const baseURL = config.public.apiBase || 'http://localhost:8000/api'
  
  return $fetch.create({
    baseURL,
    headers: {
      'Accept': 'application/json',
      'Authorization': user?.token ? `Bearer ${user.token}` : '',
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await clearUserSession(event)
      }
    }
  })
}
