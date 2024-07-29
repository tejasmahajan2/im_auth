import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { InviteOrgDto } from 'src/common/dto/invite-org.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignUpUserDto } from '../user/dto/sign-up-user.dto';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SignInUserDto } from '../user/dto/sign-in-user.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) { }

  @Get()
  dashboard(): string {
    return this.adminService.dashboard();
  }

  // Create super admin
  @Post('register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  async signUp(@Body() signUpUserDto: SignUpUserDto) {
    return await this.adminService.signUp(signUpUserDto);
  }

  @Post('login')
  async signIn(@Body() signInUserDto: SignInUserDto) {
    return await this.adminService.signIn(signInUserDto);
  }

  @Post('invite')
  async inviteOrg(@Body() inviteOrgDto: InviteOrgDto): Promise<String> {
    return await this.adminService.inviteOrg(inviteOrgDto);
  }
}
