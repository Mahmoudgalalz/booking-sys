import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = this.configService.get<string>('system.uploadPath') ?? './uploads';
    const fileName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    await fs.promises.writeFile(filePath, file.buffer);

    const baseUrl = this.configService.get<string>('system.baseUrl');
    return `${baseUrl}/uploads/${fileName}`;
  }
}
