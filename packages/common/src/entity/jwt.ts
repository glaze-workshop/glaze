export interface JwtPayload {
  /**
   * 主题 ==> 用户ID
   */
  sub: number

  /**
   * 用户 id
   */
  username: string
}
