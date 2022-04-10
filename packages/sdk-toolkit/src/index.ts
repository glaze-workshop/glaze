import { Command } from 'commander'
import { loginCommandAction } from './action'

export * from './action'
export * from './token'
export * from './axios.config'
export * from './configFileGenerator'
export * from './path'
export * from './configFileReader'
export * from './upload'

export async function createCommandLine(config: (program: Command) => void) {
  const program = new Command()
  program.version(require('../package.json').version)
  program.command('login').action(loginCommandAction)

  config(program)

  await program.parseAsync(process.argv)
}
