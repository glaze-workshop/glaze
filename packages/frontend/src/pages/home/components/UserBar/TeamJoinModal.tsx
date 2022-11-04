import { FC, memo, useCallback, useState } from 'react'
import { useUserTeams } from '../../../../hooks/self.hook'
import { useMutation } from 'react-query'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react'
import { SelfApi } from '@glaze/common'

export interface TeamJoinModalProps {
  isOpen: boolean
  onClose: () => void
}
const TeamCreationModal: FC<TeamJoinModalProps> = ({ isOpen, onClose }) => {
  const [teamId, setTeamId] = useState(0)
  const handleCloseClick = useCallback(() => {
    setTeamId(0)
    onClose()
  }, [onClose])

  const handleIdChange = useCallback((valueAsString: string, valueAsNumber: number) => {
    return setTeamId(valueAsNumber)
  }, [])

  const teamQuery = useUserTeams()

  const createTeamMutation = useMutation(SelfApi.joinTeam, {
    onSuccess: () => {
      teamQuery.refetch()
      onClose()
    }
  })

  const handleCreation = useCallback(() => {
    createTeamMutation.mutate({ teamId })
  }, [createTeamMutation, teamId])

  return (
    <Modal isOpen={isOpen} onClose={handleCloseClick}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>加入团队</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <NumberInput w="full" placeholder="团队id" value={teamId} onChange={handleIdChange}>
            <NumberInputField />
          </NumberInput>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={createTeamMutation.isLoading}
            colorScheme="blue"
            mr={3}
            onClick={handleCreation}
          >
            加入团队
          </Button>
          <Button variant="ghost" onClick={handleCloseClick}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default memo(TeamCreationModal)
