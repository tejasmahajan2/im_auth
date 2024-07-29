import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { comparePasswords, hashPassword } from 'src/common/utils/bcrypt.util';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import { SignUpUserDto } from '../user/dto/sign-up-user.dto';
import { EmailService } from '../email/email.service';
import { SignInUserDto } from '../user/dto/sign-in-user.dto';
import { generateNumericOTP, isExpired } from 'src/common/utils/otp.utils';
import { VerifyOtp } from '../user/dto/verify-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../user/entities/otp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) { }

  async signIn(
    signInUserDto: SignInUserDto,
  ): Promise<{ message: string }> {
    const userEmail = signInUserDto.email;
    const user = await this.userService.findOneByEmail(userEmail);

    if (!user) {
      throw new NotFoundException();
    }

    if (!await comparePasswords(signInUserDto.password, user.password)) {
      throw new UnauthorizedException();
    }

    const otp = generateNumericOTP();
    await this.createOrUpdateOtp(user.email, user.role, otp);

    await this.emailService.sendTestEmail(
      userEmail,
      `Your one time password : ${otp}. The otp will expires in 5 minutes.`
    );

    return { 'message': `Verification key has been sent on '${userEmail}'.` };
  }

  async createOrUpdateOtp(email: string, role: string, otp: string): Promise<Otp> {
    // Check if an OTP record already exists for the given email
    let otpEntity = await this.otpRepository.findOne({ where: { email } });

    const hashedOtp = await hashPassword(otp);

    if (otpEntity) {
      // If the OTP record exists, update the otp and createdAt fields
      otpEntity.otp = hashedOtp;
      otpEntity.createdAt = new Date(); // Update the createdAt field to current time
    } else {
      // If the OTP record does not exist, create a new record
      otpEntity = this.otpRepository.create({
        email: email,
        role: role,
        otp: hashedOtp,
        createdAt: new Date(),
      });
    }

    // Save the OTP entity to the database
    return await this.otpRepository.save(otpEntity);
  }

  async verifyOtp(
    verifyOtp: VerifyOtp,
  ) {
    const userEmail = verifyOtp.email;
    const otpUser = await this.otpRepository.findOneBy({ email: userEmail });

    if (!otpUser) {
      throw new NotFoundException();
    }

    if (isExpired(otpUser.createdAt)) {
      throw new BadRequestException('Opt has been expired.');
    }
    
    if (!await comparePasswords(`${verifyOtp.otp}`, otpUser.otp)) {
      throw new BadRequestException('Invalid opt.');
    }

    const { email, role } = otpUser;

    return {
      access_token: await this.jwtService.signAsync({ email, role }),
    };
  }

  // Main Function that handle sign up or registration of user
  async signUp(
    signUpUserDto: SignUpUserDto,
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

  async updatePassword(email: string, updatePasswordDto: UpdatePasswordDto) {
    updatePasswordDto.password = await hashPassword(updatePasswordDto.password);
    return await this.userService.updateOne(email, updatePasswordDto);
  }

  // Development
  async deleteOne(id: string) {
    return await this.userService.deleteOne(id);
  }

  async deleteAll() {
    return await this.userService.deleteAll();
  }
}