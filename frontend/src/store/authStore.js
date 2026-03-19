import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isOnboarded: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token })
      },

      setOnboarded: () => set({ isOnboarded: true }),

      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isOnboarded: false })
      },
    }),
    { name: 'gradready-auth' }
  )
)

export default useAuthStore