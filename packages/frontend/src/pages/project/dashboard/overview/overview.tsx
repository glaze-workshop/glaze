import React, { FC, memo, useCallback } from 'react'
import { useProjectInfoUnderParam } from '../../../../hooks/project.hook'
import {
  useBasicDeploymentAnalysis,
  useProjectDeploymentInfo
} from '../../../../hooks/deployment.hook'
import { useMutation } from 'react-query'
import { DeploymentApi, notEmpty } from '@glaze/common'
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  Image,
  Link,
  Stat,
  StatLabel,
  StatNumber,
  VStack
} from '@chakra-ui/react'
import dayjs from 'dayjs'

export interface OverviewProps {}

const Overview: FC<OverviewProps> = () => {
  const { projectInfo, projectId } = useProjectInfoUnderParam()
  const { deploymentInfo, deploymentQueryInfo } = useProjectDeploymentInfo()

  const initProjectMutation = useMutation(DeploymentApi.initDeployProject, {
    onSuccess: () => {
      deploymentQueryInfo.refetch()
    }
  })

  const initDeployProject = useCallback(() => {
    initProjectMutation.mutate(projectId)
  }, [initProjectMutation, projectId])

  const updateProjectDeploymentMutation = useMutation(DeploymentApi.updateProjectDeployment, {
    onSuccess: () => {
      deploymentQueryInfo.refetch()
    }
  })

  const updateDeployProject = useCallback(() => {
    updateProjectDeploymentMutation.mutate(projectId)
  }, [updateProjectDeploymentMutation, projectId])

  const { deploymentAnalysisBasic } = useBasicDeploymentAnalysis(projectId)
  return notEmpty(deploymentInfo) ? (
    <div>
      <Flex>
        <Box flexShrink={0} w="300px" borderRadius="xl" overflow="hidden" borderWidth={1}>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={deploymentInfo.screenshot ? `https://${deploymentInfo.screenshot}` : ''}
              fallbackSrc="https://bit.ly/naruto-sage"
              alt="naruto"
              objectFit="contain"
            />
          </AspectRatio>
        </Box>
        <VStack flexGrow={1} px="4" align="start">
          <Flex alignItems="baseline">
            <Badge colorScheme="green">Running</Badge>
            <Link
              ml={2}
              href={`https://${deploymentInfo.path}.glaze.localhost`}
              target="_blank"
              rel="noopener noreferrer"
              fontWeight="bold"
              fontSize="xl"
            >{`${deploymentInfo.path}.glaze.localhost`}</Link>
          </Flex>

          <Flex>
            最后由 
            <Text mx="1">{deploymentInfo.by?.nickname ?? deploymentInfo.by?.username}</Text>
            在
            <Text>{dayjs(deploymentInfo.updatedAt).toNow() }</Text>
            更新
          </Flex>

          <Button
            isLoading={updateProjectDeploymentMutation.isLoading}
            onClick={updateDeployProject}
          >
            部署项目
          </Button>
        </VStack>
      </Flex>
      <Grid mt={5} templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem w="100%" p={5} borderWidth={1} borderColor="gray.100" rounded="xl">
          <Stat>
            <StatLabel>点击量</StatLabel>
            <StatNumber>{deploymentAnalysisBasic?.count ?? 0}次</StatNumber>
          </Stat>
        </GridItem>
        <GridItem w="100%" p={5} borderWidth={1} borderColor="gray.100" rounded="xl">
          <Stat>
            <StatLabel>流量使用</StatLabel>
            <StatNumber>{deploymentAnalysisBasic?.totalSize ?? 0}byte</StatNumber>
          </Stat>
        </GridItem>
      </Grid>
    </div>
  ) : deploymentQueryInfo.isLoading ? (
    <p>Loading...</p>
  ) : (
    <Button isLoading={initProjectMutation.isLoading} onClick={initDeployProject}>
      部署项目
    </Button>
  )
}
export default memo(Overview)
