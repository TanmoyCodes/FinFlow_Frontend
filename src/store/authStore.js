import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: sessionStorage.getItem('token') || null,
  role: sessionStorage.getItem('role') || null,
  user: JSON.parse(sessionStorage.getItem('user')) || null,

  login: (token, role, userData) => {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('role', role)
    const user = userData || null;
    if (user) sessionStorage.setItem('user', JSON.stringify(user))
    set({ token, role, user })
  },

  logout: () => {
    sessionStorage.clear()
    set({ token: null, role: null, user: null })
  },

  setUser: (userData) => {
    const user = userData || null;
    if (user) sessionStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))

export default useAuthStore
