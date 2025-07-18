import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  ConflictException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseUtil } from '../utils/response-util';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.fileUploadService.uploadFile(file);
      return ResponseUtil.success(result);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}
