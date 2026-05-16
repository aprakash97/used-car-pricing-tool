import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of user service
    //find and create are used in authservices-which belongs to userService so we create a fake functions
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password }),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates new user with a salted and hashed password', async () => {
    const user = await service.signup('asd@agd.com', 'ytyt123');

    expect(user.password).not.toEqual('ytyt123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a3@asdf.com', password: 'asdf' }]);

    await expect(service.signup('a23@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('a@gmail.com', '1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a3@asdf.com', password: 'asdf' }]);

    await expect(service.signin('a3@gmail.com', '122')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'a3@asdf.com',
          password:
            '649adb271f45151c.2ae27ac614a130f9cdc97fc468b41436f48ed6e2c7b95b564b2a6827f066005b',
        },
      ]);

    const user = await service.signin('a3@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
