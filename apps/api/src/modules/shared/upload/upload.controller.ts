import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseUtil } from '../utils/response-util';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.fileUploadService.uploadFile(file);
      return ResponseUtil.success(result, 'File uploaded successfully');
    } catch (error) {
      return ResponseUtil.error(error.message, HttpStatus.CONFLICT);
    }
  }

  @Get('file/:filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const file = await this.fileUploadService.getFile(filename);
      res.set('Content-Type', `image/${filename.split('.').pop()}`);
      res.set('Content-Disposition', `inline; filename=${filename}`);
      res.send(file);
    } catch (error) {
      return ResponseUtil.error(error.message, HttpStatus.CONFLICT);
    }
  }
}
