import {
  AspectRatio,
  Badge,
  Box,
  Flex,
  Text,
  Image,
  VStack,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react'
import { notEmpty } from '@glaze/common'
import { GlazePluginControlType } from '@glaze/types'
import { FC, memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { usePluginById, usePluginParamId } from '../../../../../hooks/plugin.hook'
import { useProjectInfoUnderParam, useProjectUsedPlugin } from '../../../../../hooks/project.hook'

export interface PluginConfigProps {}

const PluginConfig: FC<PluginConfigProps> = () => {
  const pluginId = usePluginParamId()
  const { projectId } = useProjectInfoUnderParam()
  const { pluginInfo } = usePluginById(pluginId)
  const { projectUsedPluginInfo, projectUsedPluginQuery } = useProjectUsedPlugin(
    projectId,
    pluginId
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {
    if (notEmpty(projectUsedPluginInfo)) {
      const { config } = projectUsedPluginInfo
      if (notEmpty(config)) {
        reset(config)
      }
    }
  }, [projectUsedPluginInfo, reset])

  return (
    <Box>
      {pluginInfo && (
        <>
          <Flex key={pluginInfo.id} w="full" overflow="hidden" alignItems="center">
            <AspectRatio w="100px" ratio={1} flexShrink="0" rounded="base" overflow="hidden">
              <Image
                src={pluginInfo.icon ?? ''}
                fallbackSrc="https://bit.ly/naruto-sage"
                alt="naruto"
                objectFit="cover"
              />
            </AspectRatio>
            <Flex px="20px" direction="column" justifyContent="space-between">
              <Box>
                <Text fontWeight="bold">
                  {pluginInfo.name}
                  <Badge ml={1}>{pluginInfo.type}</Badge>
                </Text>
                <Text py="5px">{pluginInfo.id}</Text>
                <Text fontSize="sm">{pluginInfo.desc}</Text>
              </Box>
            </Flex>
          </Flex>

          <form onSubmit={handleSubmit((e) => console.log(e))}>
            <VStack maxW="500px" pt="20px">
              {pluginInfo.configSchema &&
                Object.keys(pluginInfo.configSchema).map((key) => {
                  const config = pluginInfo.configSchema![key]
                  function renderInput() {
                    switch (config.type) {
                      case GlazePluginControlType.TEXT:
                        return (
                          <Input
                            {...register(key, {
                              required:
                                notEmpty(config.default) && `配置项「${config.name}」不能为空`
                            })}
                          />
                        )
                      case GlazePluginControlType.NUMBER:
                        return (
                          <NumberInput>
                            <NumberInputField
                              {...register(key, {
                                required:
                                  notEmpty(config.default) && `配置项「${config.name}」不能为空`,
                                min: notEmpty(config.min)
                                  ? { value: config.min, message: `不能小于${config.min}` }
                                  : undefined,
                                max: notEmpty(config.max)
                                  ? { value: config.max, message: `不能大于${config.max}` }
                                  : undefined
                              })}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        )
                    }
                  }
                  return (
                    <FormControl key={key} isInvalid={notEmpty(errors[key]?.message)}>
                      <FormLabel>{config.name}</FormLabel>
                      {renderInput()}
                      <FormErrorMessage>{errors[key]?.message}</FormErrorMessage>
                    </FormControl>
                  )
                })}
              <FormControl>
                <Flex align="center" justify="space-between">
                  {pluginInfo.configSchema && (
                    <Button type="submit">{projectUsedPluginInfo ? '更新配置' : '安装插件'}</Button>
                  )}
                  {projectUsedPluginInfo && <Button colorScheme="pink">卸载插件</Button>}
                </Flex>
              </FormControl>
            </VStack>
          </form>
        </>
      )}
    </Box>
  )
}
export default memo(PluginConfig)
