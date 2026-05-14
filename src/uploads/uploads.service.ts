import path from 'path';
import fs from 'fs/promises';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { PostTypes } from 'src/posts/enum/post-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    // Inject UploadsRepository
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
    // Inject ConfigService
    private readonly configService: ConfigService,
  ) {}

  public async createUploadPost(user: User, file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('please provide a file in file field');

    const id = nanoid(18);
    const uploadInstance = this.uploadsRepository.create({
      fileMimeType: file.mimetype,
      filePath: `${this.configService.get('upload.uploadPathPosts')}/${id}`,
      filename: file.filename,
      postType: PostTypes.POST,
    });
    uploadInstance.id = id;
    uploadInstance.user = user;

    return await this.uploadsRepository.save(uploadInstance);
  }

  public async createUploadReel(user: User, file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('please provide a file in file field');

    const id = nanoid(24);
    const uploadInstance = this.uploadsRepository.create({
      fileMimeType: file.mimetype,
      filePath: `${this.configService.get('upload.uploadPathReels')}/${id}`,
      filename: file.filename,
      postType: PostTypes.REEL,
    });
    uploadInstance.id = id;
    uploadInstance.user = user;

    return await this.uploadsRepository.save(uploadInstance);
  }

  public async createUploadAvatar(user: User, file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('please provide a file in file field');

    const id = nanoid(18);
    const uploadInstance = this.uploadsRepository.create({
      fileMimeType: file.mimetype,
      filePath: `${this.configService.get('upload.uploadPathAvatars')}/${id}`,
      filename: file.filename,
      postType: PostTypes.AVATAR,
    });
    uploadInstance.id = id;
    uploadInstance.user = user;

    return await this.uploadsRepository.save(uploadInstance);
  }

  public async findOneUpload(id: string) {
    const file = await this.uploadsRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    if (!file) throw new NotFoundException('file not found!');

    return file;
  }

  public async deleteOneUpload(user: User, id: string) {
    const upload = await this.findOneUpload(id);

    if (user.id !== upload.user.id)
      throw new ForbiddenException("you didn't upload this file");

    const folder: string = `${upload.postType}s`;

    await fs.unlink(
      path.join(process.cwd(), 'uploads', folder, upload.filename),
    );
    await this.uploadsRepository.remove(upload);
  }
}
