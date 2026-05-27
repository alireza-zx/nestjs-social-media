import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    // Inject NotificationsRepository
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    // Inject PaginationService
    private readonly paginationService: PaginationService,
    // Inject NotificationsGateway
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  public async findAllNotifications(user: User, paginationQueryDto: PaginationQueryDto) {
    const notifications = await this.paginationService.paginate(
      this.notificationsRepository,
      paginationQueryDto,
      {
        where: ['user', 'id', user.id]
      }
    );
    for (const notification of notifications) {
      notification.isRead = true;
    }
    await this.notificationsRepository.save(notifications);

    return notifications;
  }

  public async createNotification(user: User, createNotificationDto: CreateNotificationDto) {
    const notificationInstance = this.notificationsRepository.create(createNotificationDto);
    notificationInstance.user = user;

    const notification = await this.notificationsRepository.save(notificationInstance);

    this.notificationsGateway.handleNewNotification(user, notification);
  }
}