export interface ProjectCreationDTO {
  projectFolderId: number
  name?: string
}

export interface ProjectUpdateDTO {
  id: number
  name?: string
  intro?: string
}
