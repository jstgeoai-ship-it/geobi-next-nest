import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { PasswordResetRepository } from './password-reset.repository';
import { UsersRepository } from '../users/users.repository';

/** Matches Laravel's default password_reset_tokens expiry (config/auth.php: 'expire' => 60 minutes). */
const RESET_TOKEN_TTL_MINUTES = 60;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly passwordResets: PasswordResetRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(name: string, email: string, password: string): Promise<AuthTokens & { user: PublicUser }> {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);
    const created = await this.users.create({ name, email, passwordHash });
    if (!created) throw new BadRequestException('Could not create user');

    const user: PublicUser = { id: created.id, name: created.name, email: created.email };
    const tokens = await this.issueTokens(user);
    return { ...tokens, user };
  }

  /** Mirrors Password::sendResetLink — generates+stores a hashed token; logs the "email" since MAIL_MAILER=log. */
  async requestPasswordReset(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new BadRequestException('We can\'t find a user with that email address.');

    const token = randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(token, 10);
    await this.passwordResets.upsert(email, tokenHash);

    // No real mail transport configured (parity with Laravel's MAIL_MAILER=log) — log the link instead.
    // eslint-disable-next-line no-console
    console.log(`[password-reset] link for ${email}: /reset-password/${token}?email=${encodeURIComponent(email)}`);

    return { message: 'We have emailed your password reset link.' };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const row = await this.passwordResets.findByEmail(email);
    if (!row) throw new BadRequestException('This password reset token is invalid.');

    const ageMinutes = row.created_at
      ? (Date.now() - new Date(row.created_at).getTime()) / 60000
      : Infinity;
    if (ageMinutes > RESET_TOKEN_TTL_MINUTES) {
      throw new BadRequestException('This password reset token has expired.');
    }

    const matches = await bcrypt.compare(token, row.token);
    if (!matches) throw new BadRequestException('This password reset token is invalid.');

    const user = await this.users.findByEmail(email);
    if (!user) throw new BadRequestException('This password reset token is invalid.');

    const hash = await bcrypt.hash(newPassword, 12);
    await this.users.updatePassword(user.id, hash);
    await this.passwordResets.deleteByEmail(email);

    return { message: 'Your password has been reset.' };
  }

  /** bcryptjs.compare is compatible with PHP's password_hash bcrypt output — no migration needed. */
  async validateUser(email: string, password: string): Promise<PublicUser> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) throw new UnauthorizedException('Invalid credentials');

    return { id: user.id, name: user.name, email: user.email };
  }

  async issueTokens(user: PublicUser): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_TTL'),
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_TTL'),
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<AuthTokens & { user: PublicUser }> {
    let payload: { sub: number; email: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const publicUser: PublicUser = { id: user.id, name: user.name, email: user.email };
    const tokens = await this.issueTokens(publicUser);
    return { ...tokens, user: publicUser };
  }
}
