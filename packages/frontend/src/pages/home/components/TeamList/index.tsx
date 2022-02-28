import { Box, Button, Flex, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { useUserTeams } from '../../../../hooks/self.hook'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Entity } from '@glaze/common'
import { FiPlus } from 'react-icons/fi'
import FolderList from './FolderList'
import { useNavigate } from 'react-router-dom'
import TeamCreationModal from './TeamCreationModal'

const TeamList:FC = () => {
  const teamQuery = useUserTeams()
  const teamList = useMemo(() => teamQuery.data?.data, [teamQuery.data])
  const selfTeamInfo = useMemo(() => teamList?.find(team => team.type === Entity.GlazeTeamTypeEnum.DRAFT), [teamList])
  const selfAllFolderId = useMemo(() => selfTeamInfo?.projectFolders?.find(item => item.type === Entity.GlazeFolderTypeEnum.ALL)?.id, [selfTeamInfo])

  const navigate = useNavigate()
  useEffect(() => {
    if (selfAllFolderId !== undefined) {
      navigate(`/folder/${selfAllFolderId}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfAllFolderId])

  const [teamCreationModalIsOpen, setTeamCreationModalIsOpen] = useState(false)
  const handleCreateTeam = useCallback(() => {
    setTeamCreationModalIsOpen(true)
  }, [])

  return (
    <Flex direction="column" flex="1">
      <FolderList folders={selfTeamInfo?.projectFolders} />
      <Box flex="1" overflowX="hidden" overflowY="auto" >

      </Box>
      <Box p={3}>
        <Button w="100%" onClick={handleCreateTeam} leftIcon={<Icon as={FiPlus} />} display="block" variant='outline'>创建团队</Button>
      </Box>
      <TeamCreationModal isOpen={teamCreationModalIsOpen} onClose={() => setTeamCreationModalIsOpen(false)}></TeamCreationModal>
    </Flex>
  )
}
export default TeamList
