import { spawn } from 'child_process'
import { Command } from 'commander'

const program = new Command()

const frontend = ['--filter', '*frontend']
const type = ['--filter', '*type']

const allFilters = [...frontend, ...type]

program
  .option('-d, --dev', '开发 glaze', dev)

program.parse()

function dev () {
  spawn('pnpm', ['dev', ...allFilters, '--stream', '--parallel'], { stdio: 'inherit' })
}
