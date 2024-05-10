import { HttpLoggerMiddleware } from './logger.middleware'

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new HttpLoggerMiddleware()).toBeDefined();
  });
});
