import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { comparePasswords, hashPassword } from 'src/common/utils/bcrypt.util';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async signIn(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(createUserDto.email);

    if (!user) {
      throw new NotFoundException();
    }

    if (!await comparePasswords(createUserDto.password, user.password)) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;

    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }

  async signUp(
    createUserDto: CreateUserDto,
  ) {
    const username = createUserDto.email;
    if (await this.userService.isExist(username)) {
      throw new BadRequestException('User already exist.');
    };

    createUserDto.password = await hashPassword(createUserDto.password);
    return await this.userService.create(createUserDto);
  }

  async updateOne(username: string, updateUserDto: UpdateUserDto,) {
    updateUserDto.password = await hashPassword(updateUserDto.password);
    return await this.userService.updateOne(username, updateUserDto);
  }

  // Development
  async deleteOne(id: string) {
    return await this.userService.deleteOne(id);
  }

  async deleteAll() {
    return await this.userService.deleteAll();
  }
}