import { Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(
    // Inject NotificationsService
    private readonly notificationsService: NotificationsService
  ) {}

  @Get()
  public findAllNotifications(@CurrentUser() user: User, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.notificationsService.findAllNotifications(user, paginationQueryDto);
  }
}