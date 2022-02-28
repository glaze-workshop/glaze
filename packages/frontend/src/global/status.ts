import { Entity } from '@glaze/common'
import { BehaviorSubject } from 'rxjs'
import { getToken } from '../utils/token'

export const UserSubject = new BehaviorSubject<Entity.UserEntity | null>(null)
