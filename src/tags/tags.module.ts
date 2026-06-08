import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { TagsController } from './tags.controller';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
    PaginationModule
  ],
  providers: [TagsService],
  exports: [TagsService],
  controllers: [TagsController]
})
export class TagsModule {}