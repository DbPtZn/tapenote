import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express'
import proxy from 'express-http-proxy'
import { commonConfig } from 'src/config';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly common: ReturnType<typeof commonConfig>
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }
  use(req: Request, res: Response, next: NextFunction) {
    // console.log('ProxyMiddleware');
    // console.log('req.path:', req.path);
    // console.log('req.url:', req.url);
    // console.log('req.originalUrl:', req.originalUrl);
    // if(req.originalUrl === '/auth/identify') {
    //   console.log('ProxyMiddleware');
    //   proxy(this.common.ssoDomain, {
    //     userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    //       const data = JSON.parse(proxyResData.toString('utf8'))
    //       console.log('data:', data);
    //       const account = data.account
    //       return data
    //     }
    //   })(req, res, next)
    // }
    return proxy(this.common.ssoDomain)(req, res, next)
    // next();
    // res.status(400).send('ProxyMiddleware');
  }
}
