import { Module } from '@nestjs/common';
import { SnapshotService } from './snapshot.service';
import { SnapshotController } from './snapshot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Snapshot } from './entities/snapshot.entity';
import { Project } from 'src/project/entities/project.entity';
import { StorageModule } from 'src/storage/storage.module';
import { UserLoggerModule } from 'src/user-logger/userLogger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Snapshot, Project]), StorageModule, UserLoggerModule],
  controllers: [SnapshotController],
  providers: [SnapshotService],
  exports: [SnapshotService],
})
export class SnapshotModule {}
