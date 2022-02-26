import { FormControl, FormLabel, Input, FormErrorMessage, Button, HStack, VStack, styled, Flex, Spacer, Link } from '@chakra-ui/react'
import { AuthApi, AuthDto } from '@glaze/common'
import { DevTool } from '@hookform/devtools'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link as RouterLink } from 'react-router-dom'

export interface RegisterFormProps {

}

const RegisterForm:FC<RegisterFormProps> = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<AuthDto.AuthRegisterDTO>({
    resolver: yupResolver(AuthDto.AuthRegisterSchema)
  })

  const registerMutation = useMutation(AuthApi.register)

  const onSubmit = (data: AuthDto.AuthRegisterDTO) => {
    registerMutation.mutate(data)
  }

  return (
    <>
      <form className='block' onSubmit={handleSubmit(onSubmit)}>
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
          <FormControl isInvalid={Boolean(errors.passwordAgain?.message)}>
            <FormLabel>再次输入密码</FormLabel>
            <Input type='password' {...register('passwordAgain')}/>
            <FormErrorMessage>{errors.passwordAgain?.message}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <Flex align="center">
              <Link color="blue.400" as={RouterLink} to='/login'>返回登录</Link>
              <Spacer/>
              <Button isLoading={registerMutation.isLoading} type='submit'>注册</Button>
            </Flex>
          </FormControl>
        </VStack>

      </form>
      <DevTool control={control} />
    </>
  )
}
export default RegisterForm
