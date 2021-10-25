import { spawn } from 'child_process'
import { Command } from 'commander'

const program = new Command()

const frontend = ['--filter', '*frontend']
const type = ['--filter', '*types']

const allFilters = [...frontend, ...type]

/**
 * Support win
 * @param cmd command line
 */
function crossEnvCommand (cmd: string) {
  return /^win/.test(process.platform) ? `${cmd}.cmd` : cmd
}

const pnpm = crossEnvCommand('pnpm')

function dev () {
  spawn(pnpm, ['dev', ...allFilters, '--stream', '--parallel'], { stdio: 'inherit' })
}

program
  .option('-d, --dev', '开发 glaze', dev)

program.parse()
