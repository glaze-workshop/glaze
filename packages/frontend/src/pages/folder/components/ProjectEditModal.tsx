import React, { FC, useCallback, useEffect } from 'react'
import { Entity, GlazeErr, ProjectApi } from '@glaze/common'
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useToast
} from '@chakra-ui/react'
import { useMutation, UseQueryResult } from 'react-query'
import { AxiosResponse } from 'axios'

import { useShadowInput } from '../../../hooks/utils.hook'
import { Log } from '../../../utils/log'

interface ProjectEditModalProps {
  project: Entity.ProjectEntity | null
  isOpen: boolean
  onClose: () => void
  folderQuery: UseQueryResult<AxiosResponse<Entity.ProjectFolderEntity>>
  updateFolder: () => void
}

const ProjectEditModal: FC<ProjectEditModalProps> = ({
  project,
  isOpen,
  onClose,
  folderQuery,
  updateFolder
}) => {
  isOpen = !!project && isOpen

  useEffect(() => {
    if (isOpen && project) {
      Log.HomeFolder(`edit ${project.id}:${project.name}`, project)
    }
  }, [isOpen, project])

  // ========== fields ==========
  const [name, onNameChange, { resetInput: resetName }] = useShadowInput(project?.name || '')
  const [desc, onDescChange, { resetInput: resetDesc }] = useShadowInput(project?.intro || '')

  // ========== actions ==========
  const toast = useToast()
  const updateProjectMutation = useMutation(ProjectApi.updateProject, {
    onSuccess: ({ data }) => {
      if (GlazeErr.isGlazeError(data)) {
        toast({
          title: '保存失败',
          description: data.message,
          status: 'error'
        })
      } else {
        toast({
          title: '保存成功',
          status: 'success'
        })
        onClose()
        // 刷新列表
        const targetProject = folderQuery.data?.data.projects?.filter(
          (targetProject) => targetProject.id === project?.id
        )[0]
        if (!targetProject) {
          console.error('updated project not found:', project?.id)
        }
        Object.assign(targetProject, {
          name,
          intro: desc
        })
        updateFolder()
      }
    }
  })

  const cancelEdit = useCallback(() => {
    resetName()
    resetDesc()
    onClose()
  }, [resetName, resetDesc, onClose])

  const saveEdit = useCallback(() => {
    if (!project) {
      return
    }

    updateProjectMutation.mutate({
      id: project.id,
      name,
      intro: desc
    })
  }, [project, name, desc, onClose, updateProjectMutation])

  return (
    <Modal isOpen={isOpen} onClose={cancelEdit}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>编辑项目 Id: {project?.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Edit Form */}
          <Flex direction="column" gap={2}>
            <Text fontSize={'1xl'}>项目名称:</Text>
            <Input placeholder="输入项目名称" value={name} onChange={onNameChange} />
            <Text fontSize={'1xl'}>项目描述:</Text>
            <Input placeholder="输入项目描述" value={desc} onChange={onDescChange} />
            <Text fontSize={'1xl'}>所属目录</Text>
            <Select height={10} width={300} disabled>
              <option>{project?.projectFolderId}</option>
              {/* <NumberInputField /> */}
            </Select>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={updateProjectMutation.isLoading}
            colorScheme="blue"
            mr={3}
            onClick={saveEdit}
          >
            保存修改
          </Button>
          <Button variant="ghost" onClick={cancelEdit}>
            取消
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProjectEditModal
