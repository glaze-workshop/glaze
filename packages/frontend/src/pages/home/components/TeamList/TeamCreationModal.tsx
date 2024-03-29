import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input } from '@chakra-ui/react'
import { TeamApi } from '@glaze/common'
import { useUserTeams } from '../../../../hooks/self.hook'
import React, { FC, memo, useCallback, useState } from 'react'
import { useMutation } from 'react-query'

export interface TeamCreationModalProps {
  isOpen: boolean
  onClose: () => void
}
const TeamCreationModal:FC<TeamCreationModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('')
  const handleCloseClick = useCallback(() => {
    setName('')
    onClose()
  }, [onClose])

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    return setName(e.target.value)
  }, [])

  const teamQuery = useUserTeams()

  const createTeamMutation = useMutation(TeamApi.createTeam, {
    onSuccess: ({ data }) => {
      teamQuery.refetch()
      onClose()
    }
  })

  const handleCreation = useCallback(() => {
    createTeamMutation.mutate({ name })
  }, [createTeamMutation, name])

  return (
    <Modal isOpen={isOpen} onClose={handleCloseClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>创建团队</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder='团队名称' value={name} onChange={handleNameChange} />
        </ModalBody>

        <ModalFooter>
          <Button isLoading={createTeamMutation.isLoading} colorScheme='blue' mr={3} onClick={handleCreation}>
            创建团队
          </Button>
          <Button variant='ghost' onClick={handleCloseClick}>关闭</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default memo(TeamCreationModal)
