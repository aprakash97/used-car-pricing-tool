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
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a3@asdf.com', password: 'asdf' }]);

    fakeUsersService.find = (email: string) => {
      if (email === 'a3@asdf.com') {
        return Promise.resolve([{ id: 1, email, password: 'asdf' }]);
      }

      return Promise.resolve([]);
    };

    await expect(service.signup('a3roo@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  //   it('throws if signin is called with an unused email', async () => {
  //     await expect(service.signin('a@gmail.com', '1')).rejects.toThrow(
  //       NotFoundException,
  //     );
  //   });
});
