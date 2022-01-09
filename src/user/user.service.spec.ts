import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FindUserQueryDto, UserCreateDto } from './user.dto';
import { UserRole } from './user.enum';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const mockUserRepository = {
  createUser: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  findUsersFilterWithPagination: jest.fn(),
  update: jest.fn(),
};

describe('UserService', () => {
  let userRepository: UserRepository;
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    let mockCreateUserDto: UserCreateDto;

    beforeEach(() => {
      mockCreateUserDto = {
        email: 'mock@email.com',
        name: 'Mock User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
      };
    });

    it('should create an user if passwords match', async () => {
      mockUserRepository.createUser.mockResolvedValue('mockUser');
      const result = await service.createAdminUser(mockCreateUserDto);

      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.ADMIN,
      );

      expect(result).toEqual('mockUser');
    });

    it('should throw an error if passwords doesnt match', async () => {
      mockCreateUserDto.passwordConfirmation = 'wrongPassword';
      expect(service.createAdminUser(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findUserById', () => {
    it('should return the found user', async () => {
      mockUserRepository.findOne.mockResolvedValue('mockUser');
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findUserById('mockId');
      const select = ['email', 'name', 'role', 'id'];
      expect(mockUserRepository.findOne).toHaveBeenLastCalledWith('mockId', { select });
      expect(result).toEqual('mockUser');
    });

    it('should throw an error as user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      expect(service.findUserById('mockId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should return affected > 0 if user is deleted', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteUser('mockId');
      expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('should throw an error if no user is deleted', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      expect(service.deleteUser('mockId')).rejects.toThrow(NotFoundException);
    })
  });

  describe('findUsers', () => {
    it('should call the findUsers method of the userRepository', async () => {
      mockUserRepository.findUsersFilterWithPagination.mockResolvedValue('resultsOfSearch');

      const mockFindUsersQueryDto: FindUserQueryDto = {
        name: '',
        email: '',
        limit: 1,
        page: 1,
        role: '' as any,
        sort: '',
        status: true,
      };
      const result = await service.findUsers(mockFindUsersQueryDto);

      expect(mockUserRepository.findUsersFilterWithPagination).toHaveBeenCalledWith(mockFindUsersQueryDto);
      expect(result).toEqual('resultsOfSearch');
    });
  });

  describe('updateUser', () => {
    it('should return affected > 0 if user data is updated and return the new user', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue('mockUser');

      const result = await service.updateUser('mockUpdateUserDto' as any, 'mockId');
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        'mockUpdateUserDto',
      );
      expect(result).toEqual('mockUser');
    });

    it('should throw an error if no row is affected in the DB', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 0 });

      expect(service.updateUser('mockUpdateUserDto' as any, 'mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});