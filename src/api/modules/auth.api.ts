import { httpClient } from '../client/http'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponseUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

export interface LoginResponse {
  token: string
  user: LoginResponseUser
}

export interface MeResponse {
  user: { id: string; email: string }
}

export const authApi = {
  login: (body: LoginRequest) =>
    httpClient.post<LoginResponse>('/auth/login', body, { skipAuth: true }),

  logout: () => httpClient.post<unknown>('/auth/logout', undefined, { suppressUnauthorizedHandler: true }),

  getMe: () => httpClient.get<MeResponse>('/auth/me'),
}
