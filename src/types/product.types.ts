
export interface IProduct {
    id: number,
    catagory_id: number,
    title: String,
    description: String | null,
    price: number,
    stock: number,
    created_at: Date,
}

export interface IProductWithCatagory extends IProduct {
  catagory_name: string;
}

export interface ICreateProductPayload {
    catagory_id: number;
    title: String,
    description: String,
    price: number,
    stock: number,
}

export interface IUpdateProductPayload {
    catagory_id?: number;
    title?: String,
    description?: String,
    price?: number,
    stock?: number,   
}

export interface IProductQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  catagoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'created_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}