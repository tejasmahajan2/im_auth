import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './modules/email/email.service';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { Roles } from './common/decorators/roles.decorator';
import { Role } from './common/enum/role.enum';
import { ExpressRequest } from './common/decorators/express-request.decorator';
import { User } from './modules/user/entities/user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
  ) { }

  @Get('dashboard')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Organization)
  async adminDashboard(@Req() req: ExpressRequest) : Promise<User[]> {
    return await this.appService.getAll(req);
  }

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Post('send-test-email')
  async sendEmail(
    @Body() sendEmailDTO: { recipient: string; body: string },
  ): Promise<string> {
    sendEmailDTO.recipient = 'tejasmahajan191@gmail.com';
    sendEmailDTO.body = 'Hello World';
    await this.emailService.sendTestEmail(
      sendEmailDTO.recipient,
      sendEmailDTO.body,
    );
    return 'Email has been sent.';
  }
}
