import { useMutation } from '@tanstack/react-query'
import api from '../services/api'

export function useChat() {
  return useMutation({
    mutationFn: async ({ message, conversationId }) => {
      const res = await api.post('/api/chat', { message, conversationId })
      return res.data
    },
  })
}