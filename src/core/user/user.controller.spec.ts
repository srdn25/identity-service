import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { Logger } from '@nestjs/common';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: (data) => data,
  };

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
