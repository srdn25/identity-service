import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { Logger } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { userProviders } from './user.providers';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [UserController],
      providers: [UserService, Logger, ...userProviders],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', () => {
    const email = 'user@gmail.com';
    expect(controller.create({ email })).toBe({});
  });
});
