import { Box, Flex, Icon, Stack, Text } from '@chakra-ui/react'
import { Entity } from '@glaze/common'
import { useCurrentRouterMatch } from '../../../../hooks/router.hook'
import React, { FC, memo, useCallback } from 'react'
import { FiCpu, FiFolder, FiGrid, FiTrash2 } from 'react-icons/fi'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const getIconByFolderType = (folderType: Entity.GlazeFolderType) => {
  switch (folderType) {
    case Entity.GlazeFolderTypeEnum.ALL:
      return FiGrid
    case Entity.GlazeFolderTypeEnum.ARCHIVED:
      return FiTrash2
    default:
      return FiFolder
  }
}

interface FolderProps {
  folder: Entity.ProjectFolderEntity
}

const Folder: FC<FolderProps> = ({ folder }) => {
  const path = `/folder/${folder.id}`
  const match = useCurrentRouterMatch(path)
  return (
    <Flex as={Link} to={path} px="6px" py="4px" key={folder.id} alignItems="center" bg={match ? 'gray.200' : undefined} _hover={{ bg: 'gray.200' }} cursor="pointer" borderRadius="4px">
      <Icon as={getIconByFolderType(folder.type)}/>
      <Text ml="16px" fontSize="sm">{folder.name}</Text>
    </Flex>
  )
}

interface PluginLinkProps {
  teamId?: number
}

const PluginLink: FC<PluginLinkProps> = ({ teamId }) => {
  const path = `/team-plugin/${teamId}`
  const match = useCurrentRouterMatch(path)
  return (
    <Flex as={Link} to={path} px="6px" py="4px" alignItems="center" bg={match ? 'gray.200' : undefined} _hover={{ bg: 'gray.200' }} cursor="pointer" borderRadius="4px">
      <Icon as={FiCpu}/>
      <Text ml="16px" fontSize="sm">Plugins</Text>
    </Flex>
  )
}
export interface FolderListProps {
  folders?: Entity.ProjectFolderEntity[]
  teamId?: number
}
const FolderList:FC<FolderListProps> = ({ folders, teamId }) => {
  return (
    <Stack>
      {folders?.map(folder => (
        <Folder key={folder.id} folder={folder} />
      ))}
      <PluginLink teamId={teamId} />
    </Stack>
  )
}
export default memo(FolderList)
