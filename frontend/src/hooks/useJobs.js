import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useJobs(query) {
  return useQuery({
    queryKey: ['jobs', query],
    queryFn: async () => {
      const params = query ? { query } : {}
      const res = await api.get('/api/jobs', { params })
      return res.data
    },
    staleTime: 1000 * 60 * 5,
  })
}