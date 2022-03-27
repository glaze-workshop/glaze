import prompts from 'prompts'
import axios from 'axios'
import { AuthApi, Entity, GlazeErr, SelfApi } from '@glaze/common'
import { tokenHandler } from './token'

export async function loginCommandAction () {
  const loginDto = await prompts([
    {
      type: 'text',
      name: 'username',
      message: 'Username',
      validate: value => value.length > 0 ? true : 'Username is required'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password',
      validate: value => value.length > 0 ? true : 'Password is required'
    }
  ])
  try {
    const loginRes = await AuthApi.login(loginDto)
    if (GlazeErr.isGlazeError(loginRes.data)) {
      console.error(loginRes.data.message)
    } else {
      console.log(`Logged in as ${loginRes.data.username}`)
      tokenHandler.saveToken(loginRes.data.token)
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.message)
    } else {
      console.error(err)
    }
  }
}

export async function getTeamsAction (): Promise<Entity.TeamEntity> {
  const { data } = await SelfApi.getSelfTeams()
  if (GlazeErr.isGlazeError(data)) {
    console.error(data.message)
    process.exit(1)
  } else {
    const selectedTeam = await prompts({
      type: 'select',
      name: 'team',
      message: 'Select a team',
      choices: data.map(team => ({ title: team.name, value: team }))
    })
    return selectedTeam.team
  }
}
