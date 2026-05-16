import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    //see if email already exists in db
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('Email already exists!');
    }
    //hash the password
    //1. generate salt
    //2. hash salt with password
    //3. join the hash with salt - hash + salt
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //create new user
    const result = salt + '.' + hash.toString('hex');
    const user = await this.userService.create(email, result);
    //cookie

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);

    if (!user) {
      throw new BadRequestException('Invalid Credentials!');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid Credentials!');
    } else {
      return user;
    }
  }
}
