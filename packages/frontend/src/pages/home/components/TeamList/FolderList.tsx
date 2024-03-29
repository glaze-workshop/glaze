import { Flex, Icon, Stack, Text } from '@chakra-ui/react'
import { Entity } from '@glaze/common'
import { useCurrentRouterMatch } from '../../../../hooks/router.hook'
import { FC, memo } from 'react'
import { FiCpu, FiFolder, FiGrid, FiPackage, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { IconType } from 'react-icons'

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

// interface FolderOptionProps {
//   title: string
//   Icon: IconType
//   onClick?: () => void
// }
//
// const FolderOption: FC<FolderOptionProps> = ({ title, Icon, onClick }) => {
//   return (
//     <IconButton
//       aria-label={title}
//       title={title}
//       icon={<Icon />}
//       size="xs"
//       bg="transparent"
//       _hover={{ bg: 'gray.300' }}
//       _focus={{ borderColor: 'none' }}
//       onClick={onClick}
//     />
//   )
// }

interface FolderProps {
  folder: Entity.ProjectFolderEntity
}

const Folder: FC<FolderProps> = ({ folder }) => {
  const path = `/folder/${folder.id}`
  // 选中当前 folder
  const match = useCurrentRouterMatch(path)
  return (
    <Flex
      as={Link}
      to={path}
      px="6px"
      py="4px"
      key={folder.id}
      justifyContent="space-between"
      alignItems="center"
      bg={match ? 'gray.200' : undefined}
      _hover={{ bg: 'gray.200' }}
      cursor="pointer"
      borderRadius="4px"
    >
      <Flex alignItems="center">
        <Icon as={getIconByFolderType(folder.type)} />
        <Text ml="16px" fontSize="sm">
          {folder.name}
        </Text>
      </Flex>
      {/* <Flex alignItems="center"> */}
      {/*   <FolderOption title="删除分类" Icon={FiTrash2} /> */}
      {/* </Flex> */}
    </Flex>
  )
}

interface PluginLinkProps {
  path: string
  icon: IconType
  name: string
}

const PluginLink: FC<PluginLinkProps> = ({ path, icon, name }) => {
  const match = useCurrentRouterMatch(path)
  return (
    <Flex
      as={Link}
      to={path}
      px="6px"
      py="4px"
      alignItems="center"
      bg={match ? 'gray.200' : undefined}
      _hover={{ bg: 'gray.200' }}
      cursor="pointer"
      borderRadius="4px"
    >
      <Icon as={icon} />
      <Text ml="16px" fontSize="sm">
        {name}
      </Text>
    </Flex>
  )
}

export interface FolderListProps {
  folders?: Entity.ProjectFolderEntity[]
  teamId?: number
}

const FolderList: FC<FolderListProps> = ({ folders, teamId }) => {
  return (
    <Stack>
      {folders?.map((folder) => (
        <Folder key={folder.id} folder={folder} />
      ))}
      <PluginLink path={`/team-plugin/${teamId}`} icon={FiCpu} name={'Plugins'} />
      <PluginLink path={`/team-component/${teamId}`} icon={FiPackage} name={'Components'} />
    </Stack>
  )
}
export default memo(FolderList)
