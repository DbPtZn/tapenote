import { Injectable } from '@nestjs/common'
import { StorageService } from 'src/storage/storage.service'
@Injectable()
export class UploadService {
  constructor(private readonly storageService: StorageService) {}
  uploadImage(args: { sourcePath: string; extname: string; dirname: string }) {
    return this.storageService.saveImage(args)
  }
}
