import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findOneById(id: any): Promise<User | null> {
    return await this.usersRepository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async isExist(email: string): Promise<Boolean> {
    return await this.usersRepository.exists({
      where: { email }
    });
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.save(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async updateOne(email: string, updateUserDto: UpdateUserDto): Promise<String> {
    const result = await this.usersRepository.update({ email }, { ...updateUserDto });
    return 'Password updated successfully.';
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  async filter(role: string): Promise<User[]> {
    return await this.usersRepository.createQueryBuilder('i')
      .select(["i.name", "i.id"])
      .where("i.role = role", { role: role })
      .getMany();
  }

  // Development
  async deleteOne(id: string) {
    return await this.usersRepository.delete(id);
  }

  async deleteAll() {
    return await this.usersRepository.delete({});
  }
}
