import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { BcryptModule } from 'src/bcrypt/bcrypt.module'
import { forwardRef } from '@nestjs/common'
import { FolderModule } from 'src/folder/folder.module'
import { StorageModule } from 'src/storage/storage.module'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    jest.resetModules()
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([User]), BcryptModule, forwardRef(() => FolderModule), StorageModule],
      providers: [UserService]
    }).compile()

    service = module.get<UserService>(UserService)
    // service.create()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
