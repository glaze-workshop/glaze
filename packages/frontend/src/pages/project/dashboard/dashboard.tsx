import { FC, memo, useCallback } from 'react'
import { Text, Container, Flex, HStack, Divider, Box, Button, IconButton } from '@chakra-ui/react'
import { useProjectInfoUnderParam } from '../../../hooks/project.hook'
import { Outlet, useLocation, Link as RouterLink, Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const Dashboard: FC = () => {
  const { projectInfo, projectId } = useProjectInfoUnderParam()

  const back = `/project/${projectId}`
  const dashboardPath = `/project/${projectId}/dashboard`

  return (
    <Box minH={'100vh'}>
      <Box pb={5} pt={3} bgGradient="linear-gradient(to left, #faf5ff, #f1f7ff)">
        <Container maxW="container.lg">
          <Flex alignItems="center" h="60px" gap={5} my={2}>
            <IconButton
              as={Link}
              to={back}
              aria-label={'back'}
              icon={<FiArrowLeft />}
              variant="outline"
            />
            {projectInfo ? (
              <Text fontSize="3xl" fontWeight="bold">
                {projectInfo.projectFolder?.team?.name} / {projectInfo.name}
              </Text>
            ) : undefined}
          </Flex>
          <HStack gap="20px">
            <Button variant="link" as={RouterLink} to={`${dashboardPath}`}>
              总览
            </Button>
            <Button variant="link" as={RouterLink} to={`${dashboardPath}/analysis`}>
              分析
            </Button>
            <Button variant="link" as={RouterLink} to={`${dashboardPath}/setting`}>
              设置
            </Button>
          </HStack>
        </Container>
      </Box>
      <Divider mb="20px" />
      <Container maxW="container.lg">
        <Outlet />
      </Container>
    </Box>
  )
}

export default memo(Dashboard)
