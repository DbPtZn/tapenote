import { HttpLoggerMiddleware } from './logger.middleware';

describe('HttpLoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new HttpLoggerMiddleware()).toBeDefined();
  });
});
