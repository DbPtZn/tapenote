import { Global, Module } from '@nestjs/common'
import { PouchDBService } from './pouch-db.service';

@Global()
@Module({
  providers: [PouchDBService],
  exports: [PouchDBService]
})
export class PouchDbModule {}
