export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const { user } = await getUserSession(event)

  if (!user?.token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const baseURL = config.public.apiBase || 'http://localhost:8000/api'

  try {
    await $fetch(`${baseURL}/user/password`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: {
        current_password: body.current_password,
        password: body.new_password,
        password_confirmation: body.confirm_password
      }
    })

    // Update session to reflect must_change_password = false
    await setUserSession(event, {
      user: {
        ...user,
        must_change_password: false
      }
    })

    return { success: true }
  } catch (error: any) {
    const message = error.response?._data?.message || 'Password update failed'
    const errors = error.response?._data?.errors

    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: message,
      data: errors
    })
  }
})
