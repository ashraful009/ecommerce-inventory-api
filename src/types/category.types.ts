export interface ICategory {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface ICreateCategoryPayload {
  name: string;
  description?: string;
}

export interface IUpdateCategoryPayload {
  name?: string;
  description?: string;
}