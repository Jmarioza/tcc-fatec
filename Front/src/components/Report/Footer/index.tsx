import { UserDTO } from '@/dtos/User'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { View, Text } from '@react-pdf/renderer'
import { useEffect, useState } from 'react'
import { styles } from './styles'

export function Footer() {
  const [user, setUser] = useState<UserDTO | undefined>()

  useEffect(() => {
    ;(async function () {
      try {
        const { userId } = authService.getUserAuth()
        const userResponse = await userService.getById(userId)
        if (userResponse) setUser(userResponse)
      } catch (error) {
        if (error instanceof Error) alert(error.message)
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Controle</Text>
      <Text style={styles.text}>
        Gerado por {user?.name} em {new Date().toLocaleString('pt-BR')}
      </Text>
    </View>
  )
}
