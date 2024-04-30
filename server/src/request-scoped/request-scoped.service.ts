import { Injectable, Scope } from '@nestjs/common'
// { scope: Scope.REQUEST }
@Injectable()
export class RequestScopedService {
  private requestSpecificData: any

  setData(data: any): void {
    this.requestSpecificData = data
  }

  getData(): any {
    return this.requestSpecificData
  }
}
