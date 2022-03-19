import React, { FC, memo, useCallback } from 'react'
import { Text, Container, TabPanel, TabPanels, Flex, Tabs, TabList, Tab, Button } from '@chakra-ui/react'
import { useProjectInfoUnderParam } from '../../hooks/project.hook'
import { notEmpty } from '../../utils/null'
import { useMutation } from 'react-query'
import { DeploymentApi, ProjectApi } from '@glaze/common'
import { useProjectDeploymentInfo } from '../../hooks/deployment.hook'

const Dashboard: FC = () => {
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

  return (
    <Container>
      <Flex alignItems="center" h="60px">
        {projectInfo
          ? <Text fontSize="2xl" fontWeight="bold">{projectInfo.projectFolder?.team?.name} / {projectInfo.name}</Text>
          : undefined}
      </Flex>
      {deploymentQueryInfo.isLoading
        ? <Text>Loading...</Text>
        : notEmpty(deploymentInfo)
          ? (
            <Tabs>
              <TabList>
                <Tab>部署情况</Tab>
                <Tab>数据分析</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <p>{`${deploymentInfo.path}.glaze.localhost`}</p>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>)
          : (<Button isLoading={initProjectMutation.isLoading} onClick={initDeployProject}>部署项目</Button>)
      }
    </Container>
  )
}

export default memo(Dashboard)
