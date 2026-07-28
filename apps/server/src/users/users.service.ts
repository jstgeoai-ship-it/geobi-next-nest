import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async updateProfile(userId: number, fields: { name: string; email: string }) {
    const updated = await this.users.updateProfile(userId, fields);
    if (!updated) throw new BadRequestException('User not found');
    return { id: updated.id, name: updated.name, email: updated.email };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) throw new UnauthorizedException('Current password is incorrect');

    const hash = await bcrypt.hash(newPassword, 12);
    await this.users.updatePassword(userId, hash);
    return { message: 'Password updated' };
  }

  async deleteAccount(userId: number, password: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) throw new UnauthorizedException('Password is incorrect');

    await this.users.deleteById(userId);
    return { message: 'Account deleted' };
  }
}
