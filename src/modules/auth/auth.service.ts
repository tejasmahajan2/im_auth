import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { comparePasswords, hashPassword } from 'src/common/utils/bcrypt.util';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { SignUpUserDto } from '../user/dto/sign-up-user.dto';
import { EmailService } from '../email/email.service';
import { SignInUserDto } from '../user/dto/sign-in-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async signIn(
    signInUserDto: SignInUserDto,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(signInUserDto.email);

    if (!user) {
      throw new NotFoundException();
    }

    if (!await comparePasswords(signInUserDto.password, user.password)) {
      throw new UnauthorizedException();
    }

    const message = `Verification key has been sent on ${signInUserDto.email}`;
    
    const { password, ...result } = user;

    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }

  // Main Function that handle sign up or registration of user
  async signUp(
    signUpUserDto : SignUpUserDto,
  ) {
    const email = signUpUserDto.email;
    
    if (await this.userService.isExist(email)) {
      throw new BadRequestException('User already exist.');
    };

    await this.emailService.sendTestEmail(
      signUpUserDto.email,
      `Your one time password for sign in on imentorlly. Password :${signUpUserDto.password}.`
    );
    
    signUpUserDto.password = await hashPassword(signUpUserDto.password);
    return await this.userService.create(signUpUserDto);
  }

  async updateOne(email: string, updateUserDto: UpdateUserDto,) {
    updateUserDto.password = await hashPassword(updateUserDto.password);
    return await this.userService.updateOne(email, updateUserDto);
  }

  // Development
  async deleteOne(id: string) {
    return await this.userService.deleteOne(id);
  }

  async deleteAll() {
    return await this.userService.deleteAll();
  }
}