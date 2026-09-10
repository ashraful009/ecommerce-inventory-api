import { pool } from "../config/db.js";
import {
  ICatagory,
  ICreateCatagoryPayload,
  IUpdateCatagoryPayload,
} from "../types/catagory.types.js";

export class CatagoryRepository {
  async create(payload: ICreateCatagoryPayload): Promise<ICatagory> {
    const query = `
    INSERT INTO catagories 
    (name, description) 
    Values ($1, $2) 
    RETURNING id, name, description, created_at;`;

    const values = [payload.name, payload.description || null];
    const { rows } = await pool.query<ICatagory>(query, values);
    return rows[0];
  }

  async findAll(): Promise<ICatagory[]> {
    const query = `
      SELECT 
      id, name, description, created_at
      FROM catagories
      ORDER BY id ASC;
    `;
    const { rows } = await pool.query<ICatagory>(query);
    return rows;
  }

  async findById(id: number): Promise<ICatagory | null> {
    const query = `
    SELECT 
    id, name, description, created_at 
    FROM catagories 
    WHERE id = $1;`;
    const { rows } = await pool.query<ICatagory>(query, [id]);
    return rows[0] || null;
  }

  async findByName(name: string): Promise<ICatagory | null> {
    const query = `
    SELECT 
    id, name, description, created_at
    FROM catagories
    WHERE LOWER(name) = LOWER($1);`;

    const {rows} = await pool.query<ICatagory> (query, [name]);
    return rows[0] || null;
  }

  async update(id: number, payload: IUpdateCatagoryPayload): Promise<ICatagory | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let counter = 1;

    if (payload.name !== undefined) {
      fields.push(`name = $${counter++}`); //$1
      values.push(payload.name); // a
    }

    if (payload.description !== undefined) {
      fields.push(`description = $${counter++}`); 
      values.push(payload.description); 
    }

    if (fields.length === 0) return null;

    values.push(id); 
    const query = `
      UPDATE catagories
      SET ${fields.join(', ')} 
      WHERE id = $${counter} 
      RETURNING id, name, description, created_at;
    `;

    const { rows } = await pool.query<ICatagory>(query, values);
    return rows[0] || null;
  }

  // Delete catagory by ID
  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM catagories
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }


}
