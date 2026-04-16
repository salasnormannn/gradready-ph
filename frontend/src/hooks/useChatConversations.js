import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export function useChatConversations() {
  return useQuery({
    queryKey: ['chat-conversations'],
    queryFn: async () => {
      const res = await api.get('/api/chat/conversations')
      return res.data
    },
  })
}

export function useDeleteConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/chat/conversations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] })
    },
  })
}

export async function fetchConversation(id) {
  const res = await api.get(`/api/chat/conversations/${id}`)
  return res.data
}
