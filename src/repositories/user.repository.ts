import { pool } from "../config/db.js";
import {
  ICreateUserPayload,
  IUpdateUserPayload,
  IUser,
} from "../types/user.types.js";

export class UserRepository {
  async create(payload: ICreateUserPayload): Promise<IUser> {
    const query =
      "INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at;";
    const values = [payload.name, payload.email, payload.role || "customer"];
    const { rows } = await pool.query<IUser>(query, values);
    return rows[0];
  }

  async findAll(): Promise<IUser[]> {
    const query =
      "SELECT id, name, email, role, created_at FROM users ORDER BY id ASC;";
    const { rows } = await pool.query<IUser>(query);
    return rows;
  }

  async findById(id: number): Promise<IUser | null> {
    const query =
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1;";

    const { rows } = await pool.query<IUser>(query, [id]);
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const query =
      "SELECT id, name, email, role, created_at FROM users WHERE email = $1";
    const { rows } = await pool.query<IUser>(query, [email]);
    return rows[0] || null;
  }

  async updateDynamic(
    id: number,
    payload: IUpdateUserPayload,
  ): Promise<IUser | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let counter = 1;

    if (payload.email !== undefined) {
      fields.push(`email == $${counter++}`);
      values.push(payload.email);
    }
    if (payload.name !== undefined) {
      fields.push(`name = $${counter++}`);
      values.push(payload.name);
    }

    if (payload.role !== undefined) {
      fields.push(`role = $${counter++}`);
      values.push(payload.role);
    }

    if (fields.length == 0) return null;

    values.push(id);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${counter} RETURNING id, name, email, role, created_at;`;

    const { rows } = await pool.query<IUser>(query, values);
    return rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM users
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
