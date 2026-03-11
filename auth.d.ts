declare module '#auth-utils' {
  interface User {
    token: string
    type: string
    id?: number
    name?: string
    email?: string
    must_change_password: boolean
  }

  interface UserSession {
    // Add custom session data if needed
  }
}

export {}
