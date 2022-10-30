import { spawn } from 'child_process'
import { Command } from 'commander'

const program = new Command()

const frontend = ['--filter', '*frontend']
const type = ['--filter', '*types']
const common = ['--filter', '*common']

const allFilters = [...frontend, ...type, ...common]

/**
 * Support win
 * @param cmd command line
 */
function crossEnvCommand(cmd: string) {
  return /^win/.test(process.platform) ? `${cmd}.cmd` : cmd
}

const pnpm = crossEnvCommand('pnpm')

function dev() {
  spawn(pnpm, [...allFilters, '--stream', '--parallel','dev'], {
    stdio: 'inherit',
  })
}

program.option('-d, --dev', '开发 glaze', dev)

program.parse()
