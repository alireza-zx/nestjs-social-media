import path, { join } from 'path';
import { Controller, Post, UseInterceptors, UploadedFile, Get, Res, Param, ConflictException } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsPosts, multerOptionsReels } from 'src/config/multer.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { type Response } from 'express';
import { Serialize } from 'src/common/decorators/response-serializer.decorator';
import { UploadResponseDto } from './dtos/upload-response.dto';

@Controller('uploads')
export class UploadsController {
  constructor(
    // Inject UploadsService
    private readonly uploadsService: UploadsService
  ) {}

  @Post('/posts')
  @Serialize(UploadResponseDto)
  @UseInterceptors(FileInterceptor('file', multerOptionsPosts))
  public uploadFilePosts(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.createUploadPost(user, file);
  }

  @Post('/reels')
  @Serialize(UploadResponseDto)
  @UseInterceptors(FileInterceptor('file', multerOptionsReels))
  public uploadFileReels(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.createUploadReel(user, file);
  }

  @Get('/posts/:id')
  public async sendPost(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadsService.findOneUpload(id);
    res.sendFile(path.join(process.cwd(), 'uploads', 'posts', file.filename), err => {
      if (err)
        throw new ConflictException("couldn't recieve file");
    });
  }

  @Get('/avatars/:id')
  public async sendAvatar(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadsService.findOneUpload(id);
    res.sendFile(path.join(process.cwd(), 'uploads', 'avatars', file.filename), err => {
      if (err)
        throw new ConflictException("couldn't recieve file");
    });
  }

  @Get('/reels/:id')
  public async sendReel(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadsService.findOneUpload(id);
    res.sendFile(path.join(process.cwd(), 'uploads', 'reels', file.filename), err => {
      if (err)
        throw new ConflictException("couldn't recieve file");
    });
  }
}