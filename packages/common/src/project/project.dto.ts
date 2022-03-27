export interface ProjectCreationDTO {
  projectFolderId: number
  name?: string
}

export interface ProjectUpdateDTO {
  id: number
  name?: string
  intro?: string
}

export interface ProjectPluginSettingDto {
  projectId: number
  pluginId: string
  config: Record<string, any>
}
