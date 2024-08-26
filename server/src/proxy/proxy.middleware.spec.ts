import { ProxyMiddleware } from './proxy.middleware';

describe('ProxyMiddleware', () => {
  it('should be defined', () => {
    expect(new ProxyMiddleware()).toBeDefined();
  });
});
