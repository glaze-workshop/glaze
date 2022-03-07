import { useProjectInfo, useProjectInfoUnderParam } from '../../../../hooks/project.hook'
import React, { FC, memo } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Center, Flex, Icon, IconButton, Text } from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'
import { BasicComponentId } from '../../../../components/BasicComponents/basicComponentInfo'
import { editorSharedDocument } from '../../../../components/GlazeEditor/EditorSharedDocument'

export interface TopNavProps {
}

const TopNav:FC<TopNavProps> = () => {
  const { projectInfo } = useProjectInfoUnderParam()

  const handleCreate = (id: BasicComponentId) => {
    editorSharedDocument.createNodeByComponentId(id)
  }

  return (
    <Flex h="60px" boxShadow="sm" flexShrink={0} alignItems="center" px="4px">
      <Flex alignItems="center">
        <IconButton aria-label='更多' icon={<Icon as={FiMenu}/>}></IconButton>
        {projectInfo && <Text ml="4px">{projectInfo.projectFolder?.team?.name} / {projectInfo.name}</Text>}
      </Flex>
      <Flex flex={1} alignItems='center' gap="4px" justifyContent="center">
        <Button onClick={() => handleCreate(BasicComponentId.Screen)}>创建 Screen</Button>
        <Button onClick={() => handleCreate(BasicComponentId.Font)}>创建 Font</Button>
        <Button onClick={() => handleCreate(BasicComponentId.Frame)}>创建 Frame</Button>
      </Flex>
      <Box>CurrentMembers</Box>
    </Flex>
  )
}

export default memo(TopNav)
