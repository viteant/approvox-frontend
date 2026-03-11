export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const baseURL = config.public.apiBase || 'http://localhost:8000/api'
  console.log(baseURL)
  try {
    const { access_token, token_type } = await $fetch<{ access_token: string, token_type: string }>(`${baseURL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })

    // Documentation shows /login only returns tokens.
    // We need to fetch the user profile to get 'forcePasswordChange'.
    const userProfile = await $fetch<{ data: { forcePasswordChange: boolean, [key: string]: any } }>(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `${token_type} ${access_token}`
      }
    })

    console.log('[DEBUG] User Profile Response:', userProfile)

    await setUserSession(event, {
      user: {
        token: access_token,
        type: token_type,
        ...userProfile.data,
        must_change_password: Boolean(userProfile.data.forcePasswordChange)
      },
      loggedInAt: new Date().toISOString()
    })

    return { success: true }
  } catch (error: any) {
    const message = error.response?._data?.message || 'Login failed'
    const errors = error.response?._data?.errors

    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: message,
      data: errors
    })
  }
})
