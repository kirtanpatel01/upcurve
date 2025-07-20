export interface UserType {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  profileId: string
}

// In your @/types/auth file
export interface AuthContexType {
  user: UserType | null
  loading: boolean
  logout: () => Promise<void>
  isLoggingOut: boolean
  startLogin: () => void
  loadingMsg: string
}