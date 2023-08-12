import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import { messages } from '../consts';

const userId = 1;
const userId2 = 2;
const userId3 = 3;

const notExistingUserId = 111;
const notExistingUserEmail = 'not@found.com';

const usersArray = [
  {
    id: userId,
    email: 'user1@email.com',
    token: 'some-token-123',
    featureFlags: 'canCreatePost canEditPost canUpdatePost showNewFeature',
    createdAt: '2023-07-18 13:17:00',
    updatedAt: '2023-07-18 13:17:00',
  },
  {
    id: userId2,
    email: 'user2@email.com',
    token: null,
    featureFlags: null,
    createdAt: '2023-07-18 13:17:00',
    updatedAt: '2023-07-18 13:17:00',
  },
  {
    id: userId3,
    email: 'user3@email.com',
    token: 'some-token-111',
    featureFlags: null,
    createdAt: '2023-07-18 13:17:00',
    updatedAt: '2023-07-18 13:17:00',
  },
];

describe('UserService', () => {
  let service: UserService;
  const mockRepository = {
    findAll: jest.fn(() => usersArray),
    findOne: jest.fn((target) => {
      if (target.where?.id) {
        return usersArray.find((el) => target.where.id === el.id);
      }

      if (target.where?.email) {
        return usersArray.find((el) => target.where.email === el.email);
      }

      return null;
    }),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able find all users', async () => {
    const result = await service.findAll();
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(usersArray);
  });

  it('should be able find user by id', async () => {
    const result = await service.find(usersArray[0].id);
    expect(result).toEqual(usersArray[0]);
    expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: usersArray[0].id },
    });
  });

  it('should be able find user by email', async () => {
    const result = await service.find(usersArray[1].email);
    expect(result).toEqual(usersArray[1]);
    expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: usersArray[1].email },
    });
  });

  it('should throw 404 error if not found by id', async () => {
    try {
      await service.find(notExistingUserId);
    } catch (error) {
      expect(error instanceof HttpException).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: notExistingUserId },
      });
      expect(error.message).toEqual(messages.USER_NOT_FOUND);
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
    }
  });

  it('should throw 404 error if not found by email', async () => {
    try {
      await service.find(notExistingUserEmail);
    } catch (error) {
      expect(error instanceof HttpException).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: notExistingUserEmail },
      });
      expect(error.message).toEqual(messages.USER_NOT_FOUND);
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
    }
  });

  it('should update user', async () => {
    const payload = {
      featureFlags: 'one second read delete',
      token: 'toke-updated-user',
    };
    const updatedCount = 1;

    mockRepository.update.mockImplementation(() => [updatedCount]);

    const result = await service.update(payload, userId);

    expect(result).toEqual(usersArray[0]);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(payload, {
      where: {
        id: userId,
      },
    });
    expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });
  });

  it('should throw error if updated user not found', async () => {
    mockRepository.update.mockImplementation(() => [0]);

    try {
      await service.update({}, userId);
    } catch (error) {
      expect(error instanceof HttpException).toBe(true);
      expect(error.message).toEqual(messages.USER_NOT_FOUND);
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledWith(
        {},
        {
          where: {
            id: userId,
          },
        },
      );
    }
  });

  it('should delete user by email', async () => {
    const email = 'user@identity.ca';
    const deletedCount = 1;
    mockRepository.destroy.mockImplementation(() => deletedCount);
    const result = await service.delete(email);

    expect(result).toEqual(deletedCount);
    expect(mockRepository.destroy).toHaveBeenCalledTimes(1);
    expect(mockRepository.destroy).toHaveBeenCalledWith({
      where: {
        email,
      },
    });
  });

  it('should delete user by id', async () => {
    const deletedCount = 1;
    mockRepository.destroy.mockImplementation(() => deletedCount);
    const result = await service.delete(userId);

    expect(result).toEqual(deletedCount);
    expect(mockRepository.destroy).toHaveBeenCalledTimes(1);
    expect(mockRepository.destroy).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });
  });

  it('should throw error if user for delete not found', async () => {
    mockRepository.destroy.mockImplementation(() => 0);
    try {
      await service.delete(userId);
    } catch (error) {
      expect(error instanceof HttpException).toBe(true);
      expect(mockRepository.destroy).toHaveBeenCalledTimes(1);
      expect(mockRepository.destroy).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(error.message).toEqual(messages.USER_NOT_FOUND);
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
    }
  });
});
