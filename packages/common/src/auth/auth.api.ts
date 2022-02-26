import axios from 'axios'
import { AUTH_PREFIX } from '../prefix'
import { AuthLoginDTO, AuthRegisterDTO, UserInfoWithToken } from './auth.dto'

/**
 * 注册路径
 */
export const AUTH_LOGIN_PATH = 'login'
export const FULL_AUTH_LOGIN_PATH = `${AUTH_PREFIX}/${AUTH_LOGIN_PATH}`

/**
 * 登录
 *
 * @param loginDTO 登录信息
 * @returns 用户数据和token
 */
export const login = (loginDTO: AuthLoginDTO) => axios.post<UserInfoWithToken>(FULL_AUTH_LOGIN_PATH, loginDTO)

/**
 * 注册路径
 */
export const AUTH_REGISTER_PATH = 'register'
export const FULL_AUTH_REGISTER_PATH = `${AUTH_PREFIX}/${AUTH_REGISTER_PATH}`

/**
 * 注册
 *
 * @param registerDTO 注册信息
 */
export const register = (registerDTO: AuthRegisterDTO) => axios.post(FULL_AUTH_REGISTER_PATH, registerDTO)
