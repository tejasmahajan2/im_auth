import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User])], // Always add new model/entity
  controllers: [],
  providers: [UserService],
  exports:[UserService],
})
export class UserModule {}
