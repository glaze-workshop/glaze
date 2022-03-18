import {
  AspectRatio,
  Box,
  Container,
  SimpleGrid,
  Text,
  Image,
  Flex,
  Button,
  IconButton,
  Icon
} from '@chakra-ui/react'
import React, { FC, memo, useMemo } from 'react'
import { FiPlus } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { useFolderInfo } from '../../hooks/folder.hook'
import { useModalState } from '../../hooks/modal.hook'
import ProjectBox from './components/ProjectBox'
import ProjectCreationModal from './components/ProjectCreationModal'

export interface FolderProps {}
const Folder: FC<FolderProps> = () => {
  const { folderId } = useParams()
  const numFolderId = useMemo(() => Number(folderId), [folderId])
  const folderQuery = useFolderInfo(numFolderId)

  const folderInfo = useMemo(() => folderQuery.data?.data, [folderQuery.data])
  const { isOpen, handleModelClose, handleModelOpen } = useModalState()

  return (
    <Container maxW="container.md" py="24px">
      {folderInfo && (
        <>
          <Flex pb="20px" justifyContent="space-between" alignItems="center">
            <Text fontSize="xl" fontWeight="bold">
              {folderInfo.team?.name ?? 'unknown'} / {folderInfo.name}
            </Text>
            <IconButton
              borderRadius="50%"
              size="sm"
              aria-label="创建项目"
              icon={<Icon as={FiPlus} />}
              onClick={handleModelOpen}
            />
          </Flex>
          <SimpleGrid columns={2} spacing={10}>
            {folderInfo.projects?.map((project) => (
              <ProjectBox key={project.id} project={project} />
              // <Box as={Link} to={`/project/${project.id}`} key={project.id} borderWidth='1px' borderRadius='lg' overflow='hidden'>
              //   <AspectRatio ratio={16 / 9}>
              //     <Image src={project.preview ?? ''} fallbackSrc='https://bit.ly/naruto-sage' alt='naruto' objectFit='cover' />
              //   </AspectRatio>
              //   <Box p={3}>
              //     <Text fontWeight="bold">{project.name}</Text>
              //   </Box>
              // </Box>
            ))}
          </SimpleGrid>
        </>
      )}
      <ProjectCreationModal
        folderId={numFolderId}
        isOpen={isOpen}
        onClose={handleModelClose}
      ></ProjectCreationModal>
    </Container>
  )
}
export default memo(Folder)
