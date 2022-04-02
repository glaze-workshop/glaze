import fs from 'fs'
import path from 'path'

export class TokenHandler {
  private token: string | null = null

  constructor(private filePath: string) {
    this.readToken()
  }

  saveToken(token: string) {
    this.token = token
    fs.writeFileSync(this.filePath, token)
  }

  getToken(): string | null {
    return this.token
  }

  readToken() {
    try {
      const token = fs.readFileSync(this.filePath, 'utf8')
      this.token = token.trim()
    } catch (e) {
      // do nothing because the file doesn't exist
    }
    return this.token
  }
}

export const tokenHandler = new TokenHandler(
  path.join(__dirname, '.glaze-cache-token')
)
