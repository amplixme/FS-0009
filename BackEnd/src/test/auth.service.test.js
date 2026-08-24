import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 1. vi.hoisted garantiza que mockPrisma esté listo antes de que corra vi.mock
const { mockPrisma } = vi.hoisted(() => {
  return {
    mockPrisma: {
      user: {
        create: vi.fn(),
        findUnique: vi.fn(),
      },
    },
  };
});

// 2. Mocks de dependencias
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

vi.mock('../generated/prisma/client.js', () => {
  return {
    PrismaClient: class {
      constructor() {
        return mockPrisma;
      }
    },
  };
});

vi.mock('@prisma/adapter-pg', () => {
  return {
    PrismaPg: class {
      constructor() {
        return {};
      }
    },
  };
});

// 3. Importar el servicio
import { registerUser, loginUser } from '../services/auth.service.js';

describe('Auth Service - Tests Unitarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret_key';
  });

  describe('registerUser', () => {
    it('1. Debe registrar un usuario exitosamente con contraseña hasheada y rol USER', async () => {
      const mockUserData = {
        name: 'Facundo',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockCreatedUser = {
        id: 1,
        name: 'Facundo',
        email: 'test@example.com',
        password: 'hashed_password_abc',
        role: 'USER',
      };

      bcrypt.hash.mockResolvedValue('hashed_password_abc');
      mockPrisma.user.create.mockResolvedValue(mockCreatedUser);

      const result = await registerUser(mockUserData);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Facundo',
          email: 'test@example.com',
          password: 'hashed_password_abc',
          role: 'USER',
        },
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('2. Debe lanzar error y asignar target email si ocurre error de unicidad', async () => {
      const mockUserData = {
        name: 'Facundo',
        email: 'duplicado@example.com',
        password: 'password123',
      };

      const prismaError = new Error('Unique constraint failed');
      prismaError.code = 'P2002';

      bcrypt.hash.mockResolvedValue('hashed_password_abc');
      mockPrisma.user.create.mockRejectedValue(prismaError);

      await expect(registerUser(mockUserData)).rejects.toMatchObject({
        code: 'P2002',
        meta: { target: 'email' },
      });
    });
  });

  describe('loginUser', () => {
    it('3. Debe autenticar correctamente y retornar token y datos del usuario', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const existingUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password_abc',
        name: 'Facundo',
        role: 'USER',
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocked.jwt.token');

      const result = await loginUser(credentials);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', existingUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: 1,
          email: 'test@example.com',
          name: 'Facundo',
          role: 'USER',
        },
        'test_secret_key',
        { expiresIn: '24h' }
      );
      expect(result).toEqual({
        token: 'mocked.jwt.token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Facundo',
          role: 'USER',
        },
      });
    });

    it('4. Debe fallar con status 401 si el usuario no existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        loginUser({ email: 'inexistente@example.com', password: 'password123' })
      ).rejects.toMatchObject({
        message: 'Credenciales inválidas',
        status: 401,
      });

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('5. Debe fallar con status 401 si la contraseña es incorrecta', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password_abc',
        name: 'Facundo',
        role: 'USER',
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        loginUser({ email: 'test@example.com', password: 'wrongpassword' })
      ).rejects.toMatchObject({
        message: 'Credenciales inválidas',
        status: 401,
      });

      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});