import { AspectRatio, Box, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import { Entity } from '@glaze/common'
import React, { FC, MouseEvent } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'

interface ProjectBoxProps {
  project: Entity.ProjectEntity
}

const ProjectBox: FC<ProjectBoxProps> = ({ project }) => {
  const deleteProject = (e: MouseEvent) => {
    e.preventDefault()
    console.log('Delete Project', project)
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
          <IconButton
            colorScheme="red"
            aria-label="删除项目"
            icon={<FiTrash2 />}
            onClick={deleteProject}
          />
        </Flex>
      </Flex>
    </Box>
  )
}

export default ProjectBox
