import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isOnboarded: false,

            setAuth: (user, token) => {
                // Don't manually setItem — persist middleware handles storage
                const hasProfile = user.course || user.region || user.school
                set({
                    user,
                    token,
                    isOnboarded: !!hasProfile,
                })
            },

            setOnboarded: () => set({ isOnboarded: true }),

            updateUser: (data) => set((state) => ({
                user: { ...state.user, ...data }
            })),

            logout: () => {
                // Clear both the persist key and the legacy manual key
                localStorage.removeItem('token')
                localStorage.removeItem('gradready-auth')
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
            // On rehydration, if token looks expired or malformed, clear it
            // This prevents stale tokens from surviving Render restarts
            onRehydrateStorage: () => (state) => {
                if (state?.token) {
                    try {
                        const payload = JSON.parse(atob(state.token.split('.')[1]))
                        const isExpired = payload.exp * 1000 < Date.now()
                        if (isExpired) {
                            state.logout()
                        }
                    } catch {
                        // Malformed token — clear it
                        state.logout()
                    }
                }
            },
        }
    )
)

export default useAuthStore