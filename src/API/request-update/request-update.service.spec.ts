import { Test, TestingModule } from '@nestjs/testing';
import { RequestUpdateService } from './request-update.service';
import { JwtService } from '@nestjs/jwt';
import CheckPermission from 'src/common/module/checkPermission';
import { DataSource } from 'typeorm';

describe('RequestUpdateService', () => {
  let service: RequestUpdateService;

  const mockRequestUpdateRepo = {
    findOne: jest.fn(),
    insert: jest.fn(),
    update: jest.fn()
  };
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };
  const mockCheckPermission = {
    Check: jest.fn(),
    CheckModuleAction: jest.fn()
  }
  const mockDataSource = {
    getRepository: jest.fn()
  }
  const mockEntityRepo = {
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestUpdateService,
        {
          provide: 'RequestUpdateRepository',
          useValue: mockRequestUpdateRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: CheckPermission,
          useValue: mockCheckPermission
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    mockDataSource.getRepository.mockReturnValue(mockEntityRepo);
    service = module.get<RequestUpdateService>(RequestUpdateService);

    (service as any).requestUpdateRepo = mockRequestUpdateRepo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should insert successfully when no pending request', async () => {
    const dto = {
      moduleName: 'competition',
      actionName: 'update',
      idUpdate: 1,
    };

    const req = {
      user: { id: 1 },
    };

    mockCheckPermission.Check.mockResolvedValue(true);

    mockRequestUpdateRepo.findOne.mockResolvedValue(null);

    mockRequestUpdateRepo.insert.mockResolvedValue({
      identifiers: [{ id: 123 }],
    });

    const result = await service.insert(dto as any, req as any);

    expect(mockRequestUpdateRepo.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        ...dto,
        adminId: 1,
      }),
    );

    expect(result.id).toBe(123);
  });

  it('should throw if request already exists', async () => {
    const dto = {
      moduleName: 'competition',
      actionName: 'update',
      idUpdate: 1,
    };

    const req = {
      user: { id: 1 },
    };

    mockCheckPermission.Check.mockResolvedValue(true);

    mockRequestUpdateRepo.findOne.mockResolvedValue({
      id: 1,
      status: 'wait',
    });

    await expect(
      service.insert(dto as any, req as any),
    ).rejects.toThrow('REQUEST_HAS_NOT_BEEN_PROCESSED');
  });

  it('should allow insert action without checking existing request', async () => {
    const dto = {
      moduleName: 'competition',
      actionName: 'insert',
      idUpdate: 1,
    };

    const req = {
      user: { id: 1 },
    };

    mockCheckPermission.Check.mockResolvedValue(true);

    mockRequestUpdateRepo.insert.mockResolvedValue({
      identifiers: [{ id: 456 }],
    });

    const result = await service.insert(dto as any, req as any);

    expect(result.id).toBe(456);
  });

  it('should throw if request not found', async () => {
    mockCheckPermission.Check.mockResolvedValue(true);
    mockCheckPermission.CheckModuleAction.mockResolvedValue(true);

    mockRequestUpdateRepo.findOne.mockResolvedValue(null);

    await expect(
      service.update(1, {} as any, { user: { id: 1 } }),
    ).rejects.toThrow('REQUEST_UPDATE_NOT_FOUND');
  });
  /********************** */
  it('should approve update and apply changes', async () => {
    const req = { user: { id: 1 } };

    const params = {
      actionName: 'update',
      status: 'approve',
      moduleName: 'competition',
      idUpdate: 1,
    };

    const checkRequest = {
      id: 1,
      moduleName: 'competition',
      idUpdate: 1,
    };

    const newItem = {
      id: 2,
      applyStatus: 'pendingUpdate',
      name: 'new name',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pendingId = newItem.id;

    mockCheckPermission.Check.mockResolvedValue(true);
    mockCheckPermission.CheckModuleAction.mockResolvedValue(true);

    mockRequestUpdateRepo.findOne.mockResolvedValue(checkRequest);
    mockRequestUpdateRepo.update.mockResolvedValue({ affected: 1 });

    mockEntityRepo.findOne.mockResolvedValue(newItem);

    await service.update(1, params as any, req);

    expect(mockDataSource.getRepository).toHaveBeenCalledWith('Competition');

    expect(mockEntityRepo.update).toHaveBeenNthCalledWith(
      1,
      checkRequest.idUpdate,
      expect.objectContaining({
        name: 'new name',
      }),
    );

    expect(mockEntityRepo.update).toHaveBeenNthCalledWith(
      2,
      pendingId,
      { applyStatus: 'expired' },
    );

    expect(mockRequestUpdateRepo.update).toHaveBeenCalledWith(1, params);
  });

  it('should reject update request', async () => {
    const req = { user: { id: 1 } };

    const params = {
      actionName: 'update',
      status: 'reject',
      moduleName: 'competition',
      idUpdate: 1,
    };

    const checkRequest = {
      id: 1,
      moduleName: 'competition',
      idUpdate: 1,
    };

    const newItem = {
      id: 2,
      applyStatus: 'pendingUpdate',
    };

    mockCheckPermission.Check.mockResolvedValue(true);
    mockCheckPermission.CheckModuleAction.mockResolvedValue(true);

    mockRequestUpdateRepo.findOne.mockResolvedValue(checkRequest);
    mockEntityRepo.findOne.mockResolvedValue(newItem);

    await service.update(1, params as any, req);

    expect(mockEntityRepo.update).toHaveBeenCalledWith(
      newItem.id,
      { applyStatus: 'reject' },
    );
  });

  it('should delete item when delete approved', async () => {
    const req = { user: { id: 1 } };

    const params = {
      actionName: 'delete',
      status: 'approve',
      moduleName: 'competition',
      idUpdate: 1,
    };

    const checkRequest = {
      id: 1,
      moduleName: 'competition',
      idUpdate: 1,
    };

    mockCheckPermission.Check.mockResolvedValue(true);
    mockCheckPermission.CheckModuleAction.mockResolvedValue(true);

    mockRequestUpdateRepo.findOne.mockResolvedValue(checkRequest);

    await service.update(1, params as any, req);

    expect(mockEntityRepo.delete).toHaveBeenCalledWith(1);
  });
});