const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AppError } = require('../middleware/errorHandler');
const { deleteCachedUserByEmail } = require('../database/redis');

class UserService {
  static async register({ name, username, email, phone, password }) {
    try {
      const existingUserByEmail = await User.findByEmail(email);
      if (existingUserByEmail) {
        throw new AppError('User with this email already exists', 400);
      }

      const existingUserByUsername = await User.findByUsername(username);
      if (existingUserByUsername) {
        throw new AppError('Username already exists', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        username,
        email,
        phone,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail?.includes('username')) {
          throw new AppError('Username already exists', 400);
        }

        if (error.detail?.includes('email')) {
          throw new AppError('User with this email already exists', 400);
        }

        throw new AppError('User already exists', 400);
      }

      throw error;
    }
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, name: user.name, username: user.username, email: user.email, phone: user.phone, balance: user.balance } };
  }

  static async updateProfile(id, updateData) {
    // no 3
    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // If password is being updated, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.update(id, updateData);
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    await deleteCachedUserByEmail(existingUser.email);
    if (updatedUser.email && updatedUser.email !== existingUser.email) {
      await deleteCachedUserByEmail(updatedUser.email);
    }
    // akhir no 3

    return updatedUser;
  }

  // no 2
  static async getUserByEmail(email) {
    const user = await User.findPublicByEmail(email);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
  // akhir no 2

  static async getTransactionHistory(userId) {
    return await User.getTransactionHistory(userId);
  }

  static async getTotalSpent(userId) {
    return await User.getTotalSpent(userId);
  }
}

module.exports = UserService;