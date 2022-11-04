import {
  getTeamsAction,
  GlazePath,
  readPluginConfigFile,
  renderPluginJsFile,
  uploadFiles,
} from '@glaze/sdk-toolkit'
import * as fs from 'fs'
import {
  buildFiles,
  buildFileWithPanicByConfigFile,
  parseFilePathToOutput,
} from './bundle'
import type { GlazeConfig } from '@glaze/types'
import {
  ComponentApi,
  ComponentDto,
  GlazeErr,
  PluginApi,
  PluginDto,
} from '@glaze/common'
import { handleComponentsWatch } from '@glaze/editor'

export async function generatePluginConfigAction() {
  const configFile = readPluginConfigFile()

  if (configFile) {
    console.error(
      'Plugin config file already exists. Please remove it before generating a new one.'
    )
    process.exit(1)
  }

  const team = await getTeamsAction()
  const fileData = renderPluginJsFile(team.id)
  fs.writeFileSync(GlazePath.pluginConfigPath, fileData)
  console.log('Plugin config file generated successfully.')
}

export async function buildAction() {
  const configFile = readConfigFileWithPanic()
  await buildFileWithPanicByConfigFile(configFile)
}

export async function watchAction() {
  const configFile = readConfigFileWithPanic()
  const entries = configFile.plugins.map((plugin) => plugin.main)
  console.log('Watching for changes...')
  handleComponentsWatch(configFile.components)
  await buildFiles(entries, true)
}

export async function uploadAction() {
  const configFile = readConfigFileWithPanic()
  await buildFileWithPanicByConfigFile(configFile)

  async function uploadPlugins() {
    const uploadResult = await uploadFiles(
      configFile.plugins.map((plugin) => ({
        filePath: parseFilePathToOutput(GlazePath.distPath, plugin.main),
        key: `public/team/${configFile.generated.ownerTeamId}/plugin/${plugin.id}/main.js`,
      }))
    )
    for (const { error } of uploadResult.files) {
      if (error) {
        console.error(error.message, error.stack)
        process.exit(1)
      }
    }

    const res = await Promise.all(
      uploadResult.files.map(({ data }, index) => {
        const { id, name, type, desc, icon, config } = configFile.plugins[index]
        const dto: PluginDto.GlazePluginDto = {
          id,
          name,
          type,
          desc,
          icon,
          path: data.Location,
          ownerTeamId: configFile.generated.ownerTeamId,
          configSchema: config,
        }
        return PluginApi.createOrUpdatePlugin(dto)
      })
    )

    for (const { data } of res) {
      if (GlazeErr.isGlazeError(data)) {
        if (data.status === GlazeErr.ErrorCode.PermissionDeniedError) {
          console.error(data.message)
        }
      } else {
        console.log(`Plugin 「${data.name}」 uploaded successfully.`)
      }
    }

    console.log('Upload complete.')
  }

  async function uploadComponents() {
    const uploadResult = await uploadFiles(
      configFile.components.map((plugin) => ({
        filePath: parseFilePathToOutput(
          GlazePath.componentDistPath,
          plugin.main
        ),
        key: `public/team/${configFile.generated.ownerTeamId}/component/${plugin.id}/main.js`,
      }))
    )
    for (const { error } of uploadResult.files) {
      if (error) {
        console.error(error.message, error.stack)
        process.exit(1)
      }
    }

    const res = await Promise.all(
      uploadResult.files.map(({ data }, index) => {
        const { id, name, type, desc, props, defaultSize, hasChildren } =
          configFile.components[index]
        const dto: ComponentDto.GlazeComponentDto = {
          id,
          name,
          type,
          desc,
          props,
          path: data.Location,
          ownerTeamId: configFile.generated.ownerTeamId,
          hasChildren,
          defaultSize,
        }
        return ComponentApi.createOrUpdateComponent(dto)
      })
    )

    for (const { data } of res) {
      if (GlazeErr.isGlazeError(data)) {
        if (data.status === GlazeErr.ErrorCode.PermissionDeniedError) {
          console.error(data.message)
        }
        console.error(data)
      } else {
        console.log(`Component 「${data.name}」 uploaded successfully.`)
      }
    }
  }

  await Promise.all([uploadPlugins(), uploadComponents()])
}

export function readConfigFileWithPanic(): GlazeConfig {
  const configFile = readPluginConfigFile()
  if (configFile) {
    return configFile
  } else {
    console.error(
      'Plugin config file does not exist. Please generate one before building.'
    )
    process.exit(1)
  }
}
