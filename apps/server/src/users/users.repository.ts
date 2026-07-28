import { Injectable } from '@nestjs/common';
import { QueryService } from '../database/query.util';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/** Reads/writes the existing Laravel Breeze `users` table as-is — no schema change. */
@Injectable()
export class UsersRepository {
  constructor(private readonly db: QueryService) {}

  findByEmail(email: string) {
    return this.db.one<UserRow>('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  }

  create(fields: { name: string; email: string; passwordHash: string }) {
    return this.db.one<UserRow>(
      `INSERT INTO users (name, email, password, created_at, updated_at)
       VALUES ($1, $2, $3, now(), now()) RETURNING *`,
      [fields.name, fields.email, fields.passwordHash],
    );
  }

  findById(id: number) {
    return this.db.one<UserRow>('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  }

  async updateProfile(id: number, fields: { name: string; email: string }) {
    return this.db.one<UserRow>(
      `UPDATE users SET name = $1, email = $2, updated_at = now() WHERE id = $3 RETURNING *`,
      [fields.name, fields.email, id],
    );
  }

  async updatePassword(id: number, passwordHash: string) {
    await this.db.query(`UPDATE users SET password = $1, updated_at = now() WHERE id = $2`, [
      passwordHash,
      id,
    ]);
  }

  async deleteById(id: number) {
    await this.db.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
