import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NedbRepositoryModule } from './nedb-repository/nedb-repository.module';

@Module({
  imports: [NedbRepositoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
