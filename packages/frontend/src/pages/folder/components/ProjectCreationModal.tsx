import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input } from '@chakra-ui/react'
import { ProjectApi } from '@glaze/common'
import { useFolderInfo } from '../../../hooks/folder.hook'
import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { useMutation } from 'react-query'

export interface ProjectCreationModalProps {
  folderId: number
  isOpen: boolean
  onClose: () => void
}
const ProjectCreationModal:FC<ProjectCreationModalProps> = ({ folderId, isOpen, onClose }) => {
  const [name, setName] = useState('')
  // close & clear name
  const handleCloseClick = useCallback(() => {
    setName('')
    onClose()
  }, [onClose])

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    return setName(e.target.value)
  }, [])

  const folderQuery = useFolderInfo(folderId)

  const createProjectMutation = useMutation(ProjectApi.createProject, {
    onSuccess: ({ data }) => {
      folderQuery.refetch()
      handleCloseClick()
    }
  })

  const handleCreation = useCallback(() => {
    createProjectMutation.mutate({ projectFolderId: folderId, name })
  }, [createProjectMutation, folderId, name])

  return (
    <Modal isOpen={isOpen} onClose={handleCloseClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>创建项目</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder='项目名称' value={name} onChange={handleNameChange} />
        </ModalBody>

        <ModalFooter>
          <Button isLoading={createProjectMutation.isLoading} colorScheme='blue' mr={3} onClick={handleCreation}>
            创建项目
          </Button>
          <Button variant='ghost' onClick={handleCloseClick}>关闭</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default memo(ProjectCreationModal)
