export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()

  // If user is logged in and must change password
  if (loggedIn.value && user.value?.must_change_password) {
    // Prevent redirect loop and allow access to setup page
    if (to.path !== '/auth/setup-password' && to.path !== '/login') {
      return navigateTo('/auth/setup-password')
    }
  }

  // If user is on setup page but doesn't need to change password
  if (loggedIn.value && !user.value?.must_change_password && to.path === '/auth/setup-password') {
    return navigateTo('/')
  }
})
