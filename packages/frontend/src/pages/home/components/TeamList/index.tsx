import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Text
} from '@chakra-ui/react'
import { Entity } from '@glaze/common'
import { FC, memo, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'

import { useUserTeams } from '../../../../hooks/self.hook'
import { useModalState } from '../../../../hooks/modal.hook'
import FolderList from './FolderList'
import TeamCreationModal from './TeamCreationModal'

const TeamList: FC = () => {
  const teamQuery = useUserTeams()
  const teamList = useMemo(() => teamQuery.data?.data ?? [], [teamQuery.data])
  const selfTeamInfo = useMemo(
    () => teamList?.find((team) => team.type === Entity.GlazeTeamTypeEnum.DRAFT),
    [teamList]
  )
  const otherTeams = useMemo(
    () => teamList?.filter((team) => team.type !== Entity.GlazeTeamTypeEnum.DRAFT),
    [teamList]
  )
  const selfAllFolderId = useMemo(
    () =>
      selfTeamInfo?.projectFolders?.find((item) => item.type === Entity.GlazeFolderTypeEnum.ALL)
        ?.id,
    [selfTeamInfo]
  )

  const navigate = useNavigate()
  useEffect(() => {
    if (selfAllFolderId !== undefined && location.pathname === '/') {
      navigate(`/folder/${selfAllFolderId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfAllFolderId])

  const {
    isOpen,
    handleModalClose: handleModelClose,
    handleModalOpen: handleModelOpen
  } = useModalState()

  return (
    <Flex direction="column" flex="1" overflowY="hidden">
      <Box px="16px">
        <FolderList folders={selfTeamInfo?.projectFolders} teamId={selfTeamInfo?.id} />
      </Box>
      <Text px="20px" pt="10px" pb="5px" fontWeight="bold">
        Team
      </Text>
      <Box p="4px" flex="1" overflowX="hidden" overflowY="auto">
        <Accordion defaultIndex={[0]} allowMultiple>
          {otherTeams?.map((team) => (
            <AccordionItem key={team.id}>
              <AccordionButton>
                <Avatar mr="10px" size="xs" name={team.name} src={team.logo ?? ''}></Avatar>
                <Text flex="1" textAlign="left">
                  {team.name}
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} px="12px">
                <FolderList folders={team.projectFolders} teamId={team.id} />
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
      <Box p={3}>
        <Button
          w="100%"
          onClick={handleModelOpen}
          leftIcon={<Icon as={FiPlus} />}
          display="block"
          variant="outline"
        >
          创建团队
        </Button>
      </Box>
      <TeamCreationModal isOpen={isOpen} onClose={handleModelClose}></TeamCreationModal>
    </Flex>
  )
}
export default memo(TeamList)
