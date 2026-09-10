export interface ICatagory {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface ICreateCatagoryPayload {
  name: string;
  description?: string;
}

export interface IUpdateCatagoryPayload {
  name?: string;
  description?: string;
}