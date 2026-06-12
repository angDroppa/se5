// lib/axios/auth.ts
import api from './index'
import { LoginInput, RegisterInput } from '@/lib/validators/auth'

export const login = async (data: LoginInput) => {
  const res = await api.post('/auth/login', data)
  return res.data
}

export const register = async (data: RegisterInput) => {
  const res = await api.post('/auth/register', data)
  return res.data
}

export const logout = async () => {
  await api.post('/auth/logout')
  window.location.href = '/login'
}

export const me = async () => {
  const res = await api.get('/users/me')
  return res.data.user
}