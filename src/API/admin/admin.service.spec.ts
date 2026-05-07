import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';

// mock bcrypt
jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));

import { compareSync } from 'bcrypt';
import CheckPermission from 'src/common/module/checkPermission';

describe('AdminService', () => {
  let service: AdminService;

  const mockAdminRepo = {
    findOne: jest.fn(),
    update: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };
  const mockCheckPermission = {
    Check: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: 'AdminRepository',
          useValue: mockAdminRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: CheckPermission,
          useValue: mockCheckPermission
        }
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);

    (service as any).adminRepo = mockAdminRepo;

    // mock generateToken
    service.generateToken = jest.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    const dto = {
      email: 'test@gmail.com',
      password: '123456',
    };

    const admin = {
      id: 1,
      email: 'test@gmail.com',
      password: 'hashed',
    };

    mockAdminRepo.findOne.mockResolvedValue(admin);
    (compareSync as jest.Mock).mockReturnValue(true);

    const result = await service.login(dto as any);

    expect(mockAdminRepo.update).toHaveBeenCalled();

    expect(result.accessToken).toBe('access-token');
    expect(result.data.password).toBeUndefined();
  });

  it('should throw if email not found', async () => {
    mockAdminRepo.findOne.mockResolvedValue(null);

    await expect(
      service.login({ email: 'a', password: 'b' } as any),
    ).rejects.toThrow();
  });

  it('should throw if password wrong', async () => {
    mockAdminRepo.findOne.mockResolvedValue({
      id: 1,
      email: 'test@gmail.com',
      password: 'hashed',
    });

    (compareSync as jest.Mock).mockReturnValue(false);

    await expect(
      service.login({ email: 'a', password: 'b' } as any),
    ).rejects.toThrow();
  });
});