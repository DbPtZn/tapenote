import { Injectable, NestInterceptor, ExecutionContext, BadGatewayException, CallHandler } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError(err => {
      console.log('捕获全局 Error', err)
      return throwError(() => new BadGatewayException({
        error: '捕获全局 Error',
        message: err.message
      }))
    }))
  }
}
