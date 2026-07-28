import { Injectable } from '@nestjs/common';
import { QueryService } from '../database/query.util';

interface PasswordResetRow {
  email: string;
  token: string;
  created_at: Date | null;
}

/** Reads/writes the existing Laravel `password_reset_tokens` table (email PK, hashed token, created_at). */
@Injectable()
export class PasswordResetRepository {
  constructor(private readonly db: QueryService) {}

  async upsert(email: string, tokenHash: string) {
    await this.db.query(
      `INSERT INTO password_reset_tokens (email, token, created_at) VALUES ($1, $2, now())
       ON CONFLICT (email) DO UPDATE SET token = EXCLUDED.token, created_at = EXCLUDED.created_at`,
      [email, tokenHash],
    );
  }

  findByEmail(email: string) {
    return this.db.one<PasswordResetRow>(
      'SELECT * FROM password_reset_tokens WHERE email = $1 LIMIT 1',
      [email],
    );
  }

  async deleteByEmail(email: string) {
    await this.db.query('DELETE FROM password_reset_tokens WHERE email = $1', [email]);
  }
}
