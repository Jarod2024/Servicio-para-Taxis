export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'CLIENT' | 'DRIVER' | 'ADMIN'
}
