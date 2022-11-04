import React, { FC, memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useProjectDeploymentInfo } from '../../../../hooks/deployment.hook'
import {
  Box,
  Button,
  VStack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Link,
  Spacer,
  useToast
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { DeploymentApi, GlazeErr } from '@glaze/common'
import { DevTool } from '@hookform/devtools'

export interface SettingProps {}
const Setting: FC<SettingProps> = () => {
  const { register, handleSubmit, setValue, control } = useForm<{ path: string }>()
  const { deploymentInfo, deploymentQueryInfo, projectId } = useProjectDeploymentInfo()
  const toast = useToast()

  useEffect(() => {
    if (deploymentInfo?.path) {
      setValue('path', deploymentInfo.path)
    }
  }, [deploymentInfo?.path, setValue])

  const pathMutation = useMutation(DeploymentApi.updateProjectDeploymentPath, {
    onSuccess: ({ data }) => {
      if (GlazeErr.isGlazeError(data)) {
        if (data.status === GlazeErr.ErrorCode.DeploymentPathDuplicationError) {
          toast({
            title: '路径已被使用',
            status: 'error',
            isClosable: true
          })
        }
      } else {
        deploymentQueryInfo.refetch()
      }
    }
  })

  const onSubmit = handleSubmit(({ path }) => {
    console.log(path)
    pathMutation.mutate({
      projectId,
      path
    })
  })

  return (
    <Box maxW={400}>
      <form onSubmit={onSubmit}>
        <VStack>
          <FormControl>
            <FormLabel>路径</FormLabel>
            <Input {...register('path')} />
          </FormControl>
          <FormControl>
            <Button isLoading={pathMutation.isLoading} type="submit">
              修改
            </Button>
          </FormControl>
        </VStack>
      </form>
      <DevTool control={control} />
    </Box>
  )
}
export default memo(Setting)
