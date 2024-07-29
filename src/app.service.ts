import { Body, Injectable, Post, Req } from '@nestjs/common';
import { ExpressRequest } from './common/decorators/express-request.decorator';
import { User } from './modules/user/entities/user.entity';
import { Role } from './common/enum/role.enum';
import { UserService } from './modules/user/user.service';
import { EmailService } from './modules/email/email.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getAll(@Req() req: ExpressRequest): Promise<User[] | null> {
    const user = req.user;
    const userRole = user?.role;
    const isSuperAdmin = userRole === Role.SuperAdmin;
    const filterRole = isSuperAdmin ? Role.Organization : Role.Doctor;
    return await this.userService.filter(filterRole);
  }
}
