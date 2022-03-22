import { useProjectInfo, useProjectInfoUnderParam } from '../../../../hooks/project.hook'
import React, { FC, memo } from 'react'
import { Box, Button, MenuButton, Flex, Icon, IconButton, Menu, Text, MenuItem, MenuList } from '@chakra-ui/react'
import { FiMenu, FiSettings } from 'react-icons/fi'
import { BasicComponentId } from '../../../../components/BasicComponents/basicComponentInfo'
import { editorSharedDocument } from '../../../../components/GlazeEditor/EditorSharedDocument'
import { Link } from 'react-router-dom'
import { createCustomComponentId } from '../../../../components/GlazeEditor/customSupport'

export interface TopNavProps {
}

const TopNav:FC<TopNavProps> = () => {
  const { projectInfo, projectId } = useProjectInfoUnderParam()

  const handleCreate = (id: BasicComponentId | string) => {
    editorSharedDocument.createNodeByComponentId(id)
  }

  return (
    <Flex h="60px" boxShadow="sm" flexShrink={0} alignItems="center" px="4px">
      <Flex alignItems="center">
        <Menu>
          <MenuButton as={IconButton} aria-label='更多' icon={<Icon as={FiMenu}/>}/>
          <MenuList>
            <MenuItem icon={<Icon as={FiSettings}/>} as={Link} to={`/project/${projectId}/dashboard`}>
              控制台
            </MenuItem>
          </MenuList>
        </Menu>
        {projectInfo && <Text ml="4px">{projectInfo.projectFolder?.team?.name} / {projectInfo.name}</Text>}
      </Flex>
      <Flex flex={1} alignItems='center' gap="4px" justifyContent="center">
        <Button onClick={() => handleCreate(BasicComponentId.Screen)}>创建 Screen</Button>
        <Button onClick={() => handleCreate(BasicComponentId.Font)}>创建 Font</Button>
        <Button onClick={() => handleCreate(BasicComponentId.Frame)}>创建 Frame</Button>
        {/* // TODO 这里最好本地要先创建好 A 组件，否则 createCustomComponent 里面好像还没做找不到组件的判断 */}
        <Button onClick={() => handleCreate(createCustomComponentId('A'))}>创建 A</Button>
      </Flex>
      <Box>CurrentMembers</Box>
    </Flex>
  )
}

export default memo(TopNav)
