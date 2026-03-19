import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export function useRoadmapProgress() {
  return useQuery({
    queryKey: ['roadmap-progress'],
    queryFn: async () => {
      const res = await api.get('/api/roadmap/progress')
      return res.data
    },
  })
}

export function useRoadmap() {
  return useQuery({
    queryKey: ['roadmap'],
    queryFn: async () => {
      const res = await api.get('/api/roadmap')
      return res.data
    },
  })
}

export function useToggleRoadmapItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (itemId) => {
      const res = await api.patch(`/api/roadmap/${itemId}/toggle`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] })
      queryClient.invalidateQueries({ queryKey: ['roadmap-progress'] })
    },
  })
}