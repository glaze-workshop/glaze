import { createCommandLine } from '@glaze/sdk-toolkit'
import { buildAction, generatePluginConfigAction, uploadAction, watchAction } from './action'

createCommandLine((program) => {
  program
    .command('init')
    .description('Initialize a new glaze plugin project.')
    .action(generatePluginConfigAction)

  program
    .command('build')
    .description('Bundle all plugins.')
    .action(buildAction)

  program
    .command('watch')
    .description('Watch for changes and rebuild.')
    .action(watchAction)

  program
    .command('upload')
    .description('Upload the plugin to the glaze registry.')
    .action(uploadAction)
})
