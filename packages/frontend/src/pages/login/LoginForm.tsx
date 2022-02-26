import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Link, Spacer, VStack } from '@chakra-ui/react'
import { AuthApi, AuthDto } from '@glaze/common'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { DevTool } from '@hookform/devtools'
import { useMutation } from 'react-query'
import { Link as RouterLink } from 'react-router-dom'

export interface LoginFormProps {
}

const LoginForm:FC<LoginFormProps> = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<AuthDto.AuthLoginDTO>({
    resolver: yupResolver(AuthDto.AuthLoginSchema)
  })

  const loginMutation = useMutation(AuthApi.login, {
    onSuccess: async (userInfoWithToken) => {
    }
  })

  const onSubmit = (data: AuthDto.AuthLoginDTO) => {
    loginMutation.mutate(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack>
          <FormControl isInvalid={Boolean(errors.username?.message)}>
            <FormLabel>用户名</FormLabel>
            <Input {...register('username')}/>
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.password?.message)}>
            <FormLabel>密码</FormLabel>
            <Input type='password' {...register('password')}/>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <Flex align="center">
              <Button isLoading={loginMutation.isLoading} type='submit'>登录</Button>
              <Spacer />
              <Link color="blue.400" as={RouterLink} to='/register'>注册账号</Link>
            </Flex>
          </FormControl>
        </VStack>
      </form>
      <DevTool control={control} />
    </>
  )
}

export default LoginForm
