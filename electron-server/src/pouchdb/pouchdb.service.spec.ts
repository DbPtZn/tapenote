import { Test, TestingModule } from '@nestjs/testing'
import { PouchDBService } from './pouchdb.service'

describe('PouchDbService', () => {
  let service: PouchDBService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PouchDBService]
    }).compile()

    service = module.get<PouchDBService>(PouchDBService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
