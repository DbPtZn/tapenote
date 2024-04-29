import { Injectable } from '@nestjs/common'

export const AUTH_CONTEXT = 'AUTH_CONTEXT'

@Injectable()
export class AuthContext {
  private context = new Map<string, any>()

  set<T>(key: string, value: T): void {
    this.context.set(key, value)
  }

  get<T>(key: string): T {
    return this.context.get(key)
  }
}
