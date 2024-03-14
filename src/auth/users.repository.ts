import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { User } from './user.entity';
import { Repository } from 'typeorm';

export interface IUsersRepository extends Repository<User> {
  this: Repository<User>;
  createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
}

enum EUserErrors {
  Duplicate = '23505',
}

export const UsersRepository: Pick<IUsersRepository, any> = {
  async createUser({ username, password }: AuthCredentialsDto): Promise<void> {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === EUserErrors.Duplicate) {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  },
};
