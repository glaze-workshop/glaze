import { Box, Center, Container, Heading } from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import { cleanToken } from '../../utils/token'
import LoginForm from './LoginForm'

export interface LoginProps {

}

const Login:FC<LoginProps> = () => {
  useEffect(() => {
    cleanToken()
  }, [])

  return (
    <Container maxW="container.sm" h="100vh" centerContent>
      <Box w="350px" pt="80px">
        <Heading mb="10px">LOGIN</Heading>
        <LoginForm />
      </Box>
    </Container>
  )
}
export default Login
