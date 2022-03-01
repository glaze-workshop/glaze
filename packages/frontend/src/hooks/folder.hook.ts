import { FolderApi } from '@glaze/common'
import { useQuery } from 'react-query'

export function useFolderInfo (folderId: number) {
  return useQuery([FolderApi.FULL_FOLDER_PATH_WITH_ID, folderId], () => FolderApi.getFolder(folderId))
}
