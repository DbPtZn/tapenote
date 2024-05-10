import { JwtAuthGuard } from './auth.guard'

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined()
  })
})
