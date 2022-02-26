import { Box, Center, Container, Heading, Text } from '@chakra-ui/react'
import { VerticalConstraint } from '@glaze/types'
import React, { FC } from 'react'
import RegisterForm from './RegisterForm'

export interface RegisterProps {

}
const Register:FC<RegisterProps> = () => {
  return (
    <Container maxW="container.sm" h="100vh" centerContent>
      <Box w="350px" pt="80px">
        <Heading mb="10px">REGISTER</Heading>
        <RegisterForm />
      </Box>
    </Container>
  )
}
export default Register
