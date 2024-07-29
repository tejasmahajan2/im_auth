import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Role } from 'src/common/enum/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ExpressRequest } from 'src/common/decorators/express-request.decorator';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('login')
  signIn(@Body() createUserDto: CreateUserDto) {
    return this.authService.signIn(createUserDto);
  }

  @Post('admin/register')
  signUpAdmin(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = Role.SuperAdmin;
    return this.authService.signUp(createUserDto);
  }

  @Post('org/register')
  signUpOrganization(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = Role.Organization;
    return this.authService.signUp(createUserDto);
  }

  @Post('register')
  signUpDoctor(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = Role.Doctor;
    return this.authService.signUp(createUserDto);
  }

  // Developement Purpose
  @Patch('update-password')
  @UseGuards(AuthGuard)
  updatePassword(@Req() req: ExpressRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateOne(req.user.username, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @Roles(Role.SuperAdmin)
  deleteUser(@Req() req: ExpressRequest) {
    return this.authService.deleteOne(req['user'].id);
  }

  @Delete('delete-all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  deleteAllUser() {
    return this.authService.deleteAll();
  }
}