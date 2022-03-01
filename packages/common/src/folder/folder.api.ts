import axios from 'axios'
import { compile } from 'path-to-regexp'
import { Entity } from '..'
import { FOLDER_PREFIX } from '../prefix'
import { FolderCreationDTO, FolderUpdateDTO } from './folder.dto'

export const FOLDER_PATH = ''
export const FULL_FOLDER_PATH = `${FOLDER_PREFIX}`

/**
 * 新建文件夹 dto
 * @param folderDTO 文件dto
 * @returns
 */
export const createFolder = (folderDTO: FolderCreationDTO) =>
  axios.post(FULL_FOLDER_PATH, folderDTO)

export const FOLDER_PATH_WITH_ID = ':id'
export const FULL_FOLDER_PATH_WITH_ID = `${FOLDER_PREFIX}/${FOLDER_PATH_WITH_ID}`
export const FULL_FOLDER_PATH_WITH_ID_TO_PATH = compile<{id: number}>(FULL_FOLDER_PATH_WITH_ID)

export const updateFolder = (folderDTO: FolderUpdateDTO) =>
  axios.put(FULL_FOLDER_PATH_WITH_ID_TO_PATH({ id: folderDTO.id }), folderDTO)

export const getFolder = (id: number) =>
  axios.get<Entity.ProjectFolderEntity>(FULL_FOLDER_PATH_WITH_ID_TO_PATH({ id }))

export const deleteFolder = (id: number) =>
  axios.delete(FULL_FOLDER_PATH_WITH_ID_TO_PATH({ id }))
