import path, { join } from 'path';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Res,
  Param,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  multerOptionsPosts,
  multerOptionsReels,
} from 'src/config/multer.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { type Response } from 'express';
import { Serialize } from 'src/common/decorators/response-serializer.decorator';
import { UploadResponseDto } from './dtos/upload-response.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AUTH_NONE } from 'src/auth/constants/meta-data.consts';

@Controller('uploads')
export class UploadsController {
  constructor(
    // Inject UploadsService
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('/posts')
  @Serialize(UploadResponseDto)
  @UseInterceptors(FileInterceptor('file', multerOptionsPosts))
  public uploadFilePosts(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadsService.createUploadPost(user, file);
  }

  @Post('/reels')
  @Serialize(UploadResponseDto)
  @UseInterceptors(FileInterceptor('file', multerOptionsReels))
  public uploadFileReels(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadsService.createUploadReel(user, file);
  }

  @Get('/posts/:id')
  public async sendPost(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadsService.findOneUpload(id);
    res.sendFile(
      path.join(__dirname, '..', '..', 'uploads', 'posts', file.filename),
    );
  }

  @Get('/avatars/:id')
  public async sendAvatar(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadsService.findOneUpload(id);
    res.sendFile(
      path.join(__dirname, '..', '..', 'uploads', 'avatars', file.filename),
    );
  }

  @Get('/reels/:id')
  @Auth(AUTH_NONE)
  public async sendReel(@Param('id') id: string, @Res() res: Response) {
    const file = await this.uploadsService.findOneUpload(id);
    res.sendFile(
      path.join(__dirname, '..', '..', 'uploads', 'reels', file.filename),
    );
  }
}