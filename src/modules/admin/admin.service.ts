import { Injectable, UseGuards } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { InviteOrgDto } from 'src/common/dto/invite-org.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { Role } from 'src/common/enum/role.enum';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { SignUpUserDto } from '../user/dto/sign-up-user.dto';
import { generateRandomPassword } from 'src/common/utils/password.utils';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SignInUserDto } from '../user/dto/sign-in-user.dto';
import { VerifyOtp } from '../user/dto/verify-otp.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';

@Injectable()
export class AdminService {
    constructor(
        private readonly emailService: EmailService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    dashboard(): string {
        return 'Welcome to admin dashboard!';
    }

    // Admin signup
    async signUp(signUpUserDto: SignUpUserDto) {
        signUpUserDto.password = generateRandomPassword();
        signUpUserDto.role = Role.SuperAdmin;
        signUpUserDto.createdBy = 'defaultUser';
        return await this.authService.signUp(signUpUserDto);
    }

    async signIn(signInUserDto: SignInUserDto) {
        return await this.authService.signIn(signInUserDto);
    }

    async verifyOtp(verifyOtp: VerifyOtp) {
        return await this.authService.verifyOtp(verifyOtp);
    }

    async updatePassword(email: string, updatePasswordDto: UpdatePasswordDto) {
        return await this.authService.updatePassword(email, updatePasswordDto);
    }

    async inviteOrg(inviteOrgDto: InviteOrgDto): Promise<string> {
        try {
            const orgEmail = inviteOrgDto.email;
            await this.emailService.sendTestEmail(orgEmail);
            return `Invite for "${inviteOrgDto.org_name}" has been sent on email "@${orgEmail}".`;
        } catch (error) {
            return error;
        }
    }
}
