import { Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { OrderBy } from './enums/order.enum';
import { PaginationOptions } from './interfaces/pagination-options.interface';

@Injectable()
export class PaginationService {
  public async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationQueryDto: PaginationQueryDto,
    options?: PaginationOptions<T>,
  ) {
    let where: object | undefined;
    let orderObj: object;
    let relations: Array<string> | undefined;

    switch (paginationQueryDto.order) {
      case OrderBy.CREATEDAT:
        orderObj = { createdAt: 'DESC' };
        break;

      case OrderBy.LIKES:
        orderObj = { likesCount: 'DESC' };
        break;

      case OrderBy.COMMENTS:
        orderObj = { commentsCount: 'DESC' };
        break;

      case OrderBy.POSTS:
        orderObj = { postsCount: 'DESC' };
        break;

      default:
        orderObj = { createdAt: 'DESC' };
        break;
    }

    if (options?.where) {
      if (options.where[1] === 'none') {
        where = {
          [options.where[0]]: options.where[2],
        };
      } else {
        where = {
          [options.where[0]]: { [options.where[1]]: options.where[2] },
        };
      }
    }
    if (options?.relations) {
      relations = options.relations;
    }

    return await repository.find({
      where,
      take: paginationQueryDto.limit,
      skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
      order: orderObj,
      relations,
    });
  }
}
