import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { clearCookies } from '../auth/utils/clear-cookies';
import { type Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsAvatars } from 'src/config/multer.config';
import { Serialize } from 'src/common/decorators/response-serializer.decorator';
import { UserResponseDto } from './dtos/user-response.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { Roles } from './enums/roles.enum';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { Throttle } from '@nestjs/throttler';
import { ProfileResponseDto } from './dtos/profile-response.dto';

@Controller('users')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(
    // Inject UsersService
    private readonly usersService: UsersService
  ) {}
  
  @Get('/profile')
  @Serialize(ProfileResponseDto)
  public getUser(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:id')
  public findOneUser(@Param('id') id: string) {
    return this.usersService.findOneUserById(id);
  }

  @Get('/username/:username')
  public findUsersByUsername(@Param('username') username: string) {
    return this.usersService.findOneUserById(username);
  }

  @Patch()
  public updateUser(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user, updateUserDto);
  }

  @Patch('/avatar')
  @UseInterceptors(FileInterceptor('file', multerOptionsAvatars))
  public updateAvatar(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateAvatar(user, file);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  public async deleteUser(@Res({ passthrough: true }) res: Response, @CurrentUser() user: User) {
    const deleted = await this.usersService.deleteUser(user);
    clearCookies(res, 'accessToken', 'refreshToken');
    return deleted;
  }

  // Admin routes
  @Get()
  @Role([Roles.ADMIN])
  @Throttle({ default: { limit: 300, ttl: 60000 } })
  public findAllUsersAdmin(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.usersService.findAllUsers(paginationQueryDto);
  }

  @Patch('/:id')
  @Role([Roles.ADMIN])
  @Throttle({ default: { limit: 300, ttl: 60000 } })
  public updateOneUserAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOneUser(id, updateUserDto);
  }

  @Delete('/:id')
  @Role([Roles.ADMIN])
  @Throttle({ default: { limit: 300, ttl: 60000 } })
  public deleteOneUserAdmin(@Param('id') id: string) {
    return this.usersService.deleteOneUser(id);
  }
}