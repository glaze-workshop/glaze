import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { Container, SimpleGrid, Text, Flex, IconButton, Icon, Box } from '@chakra-ui/react'
import { Entity } from '@glaze/common'

import { useFolderInfo } from '../../hooks/folder.hook'
import { useModalState } from '../../hooks/modal.hook'
import { useForceRerender } from '../../hooks/utils.hook'
import { Log } from '../../utils/log'
import ProjectBox from './components/ProjectBox'
import ProjectCreationModal from './components/ProjectCreationModal'
import ProjectEditModal from './components/ProjectEditModal'

export interface FolderProps {}
const Folder: FC<FolderProps> = () => {
  const { folderId } = useParams()
  const numFolderId = useMemo(() => Number(folderId), [folderId])
  const folderQuery = useFolderInfo(numFolderId)

  const folderInfo = useMemo(() => folderQuery.data?.data, [folderQuery.data])
  const { isOpen, handleModalClose, handleModalOpen } = useModalState()
  const forceUpdate = useForceRerender()

  const isFolderArchived = folderInfo?.type === 'ARCHIVED'

  // for ProjectEditModal
  const [editTarget, setEditTarget] = useState<Entity.ProjectEntity | null>(null)
  const {
    isOpen: isEditModalOpen,
    handleModalClose: handleEditModalClose,
    handleModalOpen: handleEditModalOpen
  } = useModalState()
  const openEditModal = useCallback((project: Entity.ProjectEntity) => {
    setEditTarget(project)
    handleEditModalOpen()
  }, [])

  useEffect(() => {
    Log.HomeFolder('folderInfo', folderInfo)
  }, [folderInfo])

  return (
    <Container maxW="container.md" py="24px" height="100%">
      <Flex direction="column" height="100%">
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
                onClick={handleModalOpen}
              />
            </Flex>
            <Box flex={1} overflow="auto">
              <SimpleGrid columns={2} spacing={10}>
                {folderInfo.projects?.map((project) => (
                  <ProjectBox
                    key={project.id}
                    project={project}
                    folderQuery={folderQuery}
                    isArchived={isFolderArchived}
                    openEditModal={openEditModal}
                  />
                ))}
              </SimpleGrid>
            </Box>
          </>
        )}
      </Flex>
      <ProjectCreationModal folderId={numFolderId} isOpen={isOpen} onClose={handleModalClose} />
      <ProjectEditModal
        project={editTarget}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        folderQuery={folderQuery}
        updateFolder={forceUpdate}
      />
    </Container>
  )
}
export default memo(Folder)
