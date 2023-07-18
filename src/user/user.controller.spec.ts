import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { Logger } from '@nestjs/common';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const userId = 1;
  const userService = {
    create: (dto) => {
      return Promise.resolve({
        id: userId,
        token: null,
        featureFlags: null,
        ...dto,
      });
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, Logger],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const email = 'user@gmail.com';

    const result = await controller.create({ email });
    expect(result).toStrictEqual({
      id: userId,
      email,
      token: null,
      featureFlags: null,
    });
  });
});
