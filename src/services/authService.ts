import { AppError } from '../middleware/errorHandler';
import { User } from '../models';
import { comparePassword, hashPassword } from '../utils/hash';
import { signToken } from '../utils/jwt';

export const register = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed });

  const token = signToken({ id: user.id, email: user.email });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const token = signToken({ id: user.id, email: user.email });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const getProfile = async (userId: string) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
};
