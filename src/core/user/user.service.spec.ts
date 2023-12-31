import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import { messages } from '../../consts';

const userId = 1;
const userId2 = 2;
const userId3 = 3;

const notExistingUserId = 111;
const notExistingUserEmail = 'not@found.com';

const usersArray = [
  {
    id: userId,
    guid: 'user1@email.com',
    token: 'some-token-123',
    featureFlags: 'canCreatePost canEditPost canUpdatePost showNewFeature',
    createdAt: '2023-07-18 13:17:00',
    updatedAt: '2023-07-18 13:17:00',
  },
  {
    id: userId2,
    guid: 'user2@email.com',
    token: null,
    featureFlags: null,
    createdAt: '2023-07-18 13:17:00',
    updatedAt: '2023-07-18 13:17:00',
  },
  {
    id: userId3,
    guid: 'user3@email.com',
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

      if (target.where?.guid) {
        return usersArray.find((el) => target.where.email === el.guid);
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
    const result = await service.findAll(1);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(usersArray);
  });

  it('should be able find user by id', async () => {
    const result = await service.findById(usersArray[0].id);
    expect(result).toEqual(usersArray[0]);
    expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: usersArray[0].id },
    });
  });

  it('should be able find user by guid', async () => {
    const result = await service.findByGuid(usersArray[1].guid);
    expect(result).toEqual(usersArray[1]);
    expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { guid: usersArray[1].guid },
    });
  });

  it('should throw 404 error if not found by id', async () => {
    try {
      await service.findById(notExistingUserId);
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

  it('should throw 404 error if not found by guid', async () => {
    try {
      await service.findByGuid(notExistingUserEmail);
    } catch (error) {
      expect(error instanceof HttpException).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { guid: notExistingUserEmail },
      });
      expect(error.message).toEqual(messages.USER_NOT_FOUND);
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
    }
  });

  it('should delete user by email', async () => {
    const email = 'user@identity.ca';
    const deletedCount = 1;
    mockRepository.destroy.mockImplementation(() => deletedCount);
    const result = await service.deleteByGuid(email);

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
    const result = await service.deleteById(userId);

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
      await service.deleteById(userId);
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
