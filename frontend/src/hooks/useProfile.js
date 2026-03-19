import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/api/users/profile')
      return res.data
    },
  })
}