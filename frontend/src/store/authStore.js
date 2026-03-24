import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isOnboarded: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        const hasProfile = user.course || user.region || user.school
        set({
          user,
          token,
          isOnboarded: hasProfile ? true : false,
        })
      },

      setOnboarded: () => set({ isOnboarded: true }),

      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('gradready-auth')
        // Clear all user-specific gov status keys
        Object.keys(localStorage)
          .filter(function(key) {
            return key.startsWith('gradready-gov-statuses')
          })
          .forEach(function(key) {
            localStorage.removeItem(key)
          })
        set({ user: null, token: null, isOnboarded: false })
      },
    }),
    {
      name: 'gradready-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
)

export default useAuthStore