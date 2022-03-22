import { getTeamsAction, GlazePath, readPluginConfigFile, renderPluginJsFile, uploadFiles } from '@glaze/sdk-toolkit'
import * as fs from 'fs'
import { buildFiles, buildFileWithPanicByConfigFile, parseFilePathToOutput } from './bundle'
import type { GlazeConfig } from '@glaze/types'
import _ from 'lodash'
import { GlazeErr, PluginApi, PluginDto } from '@glaze/common'

export async function generatePluginConfigAction () {
  const configFile = readPluginConfigFile()

  if (configFile) {
    console.error('Plugin config file already exists. Please remove it before generating a new one.')
    process.exit(1)
  }

  const team = await getTeamsAction()
  const fileData = renderPluginJsFile(team.id)
  fs.writeFileSync(GlazePath.pluginConfigPath, fileData)
  console.log('Plugin config file generated successfully.')
}

export async function buildAction () {
  const configFile = readConfigFileWithPanic()
  await buildFileWithPanicByConfigFile(configFile)
}

export async function watchAction () {
  const configFile = readConfigFileWithPanic()
  const entries = configFile.plugins.map(plugin => plugin.main)
  console.log('Watching for changes...')
  await buildFiles(entries, true)
}

export async function uploadAction () {
  const configFile = readConfigFileWithPanic()
  await buildFileWithPanicByConfigFile(configFile)

  const uploadResult = await uploadFiles(
    configFile.plugins.map(plugin => ({
      filePath: parseFilePathToOutput(plugin.main),
      key: `public/team/${configFile.generated.ownerTeamId}/plugin/${plugin.id}/main.js`
    }))
  )
  for (const { error } of uploadResult.files) {
    if (error) {
      console.error(error.message, error.stack)
      process.exit(1)
    }
  }

  const res = await Promise.all(uploadResult.files.map(({ data }, index) => {
    const { id, name, type, desc, icon } = configFile.plugins[index]
    const dto: PluginDto.GlazePluginDto = {
      id,
      name,
      type,
      desc,
      icon,
      path: data.Location,
      ownerTeamId: configFile.generated.ownerTeamId
    }
    return PluginApi.createOrUpdatePlugin(dto)
  }))

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

export function readConfigFileWithPanic (): GlazeConfig {
  const configFile = readPluginConfigFile()
  if (configFile) {
    return configFile
  } else {
    console.error('Plugin config file does not exist. Please generate one before building.')
    process.exit(1)
  }
}
