import { AspectRatio, Box, Flex, IconButton, Image, Text, useToast } from '@chakra-ui/react'
import { Entity, GlazeErr, ProjectApi } from '@glaze/common'
import React, { FC, MouseEvent, useEffect } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useMutation, UseQueryResult } from 'react-query'
import { Link } from 'react-router-dom'

import { Log } from '../../../utils/log'
interface ProjectBoxProps {
  project: Entity.ProjectEntity
  folderQuery: UseQueryResult
  isArchived?: boolean
}

const ProjectBox: FC<ProjectBoxProps> = ({ project, folderQuery, isArchived }) => {
  useEffect(() => {
    Log.HomeFolder(`ProjectBox ${project.id}`, project)
  }, [project])

  // TODO: 当前使用 archive 替代删除项目
  // const deleteProjectMutation = useMutation(ProjectApi.deleteProject, {
  //   onSuccess: ({ data }) => {
  //     Log.HomeFolder(`delete project ${project.id} success`, data)
  //   }
  // })
  const toast = useToast()
  const archiveProjectMutation = useMutation(ProjectApi.archiveProject, {
    onSuccess: ({ data }) => {
      if (GlazeErr.isGlazeError(data)) {
        // 删除失败
        toast({
          title: `删除项目${project.name}失败`,
          description: data.message,
          status: 'error'
        })
      } else {
        // 删除成功
        Log.HomeFolder(`Archive project ${project.id} success`, data)
        toast({
          title: `删除项目${project.name}成功`,
          description: data.message,
          status: 'success'
        })
        // 刷新列表
        folderQuery.refetch()
      }
    }
  })
  const deleteProject = (e: MouseEvent) => {
    e.preventDefault()
    archiveProjectMutation.mutate(project.id)
  }

  return (
    <Box
      as={Link}
      to={`/project/${project.id}`}
      key={project.id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <AspectRatio ratio={16 / 9}>
        <Image
          src={project.preview ?? ''}
          fallbackSrc="https://bit.ly/naruto-sage"
          alt="naruto"
          objectFit="cover"
        />
      </AspectRatio>
      <Flex p={3} justify="space-between" align="center">
        <Text fontWeight="bold">{project.name}</Text>
        <Flex alignItems="center">
          {!isArchived && (
            <IconButton
              colorScheme="red"
              aria-label="删除项目"
              icon={<FiTrash2 />}
              onClick={deleteProject}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default ProjectBox
