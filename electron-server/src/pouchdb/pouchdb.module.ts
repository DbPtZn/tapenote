import { Global, Module } from '@nestjs/common'
import { PouchDBService } from './pouchdb.service'

@Global()
@Module({
  providers: [PouchDBService],
  exports: [PouchDBService]
})
export class PouchDbModule {}
