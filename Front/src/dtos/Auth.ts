export interface TokenDTO {
  access_token: string
  created_date: string
  expiry_date: string
  token_type: string
  user_id: number
}

export interface NewPasswordDTO {
  tempPassword: string
  newPassword: string
  username: string
}
