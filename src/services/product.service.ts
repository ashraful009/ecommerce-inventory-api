
import { CatagoryRepository } from '../repositories/catagory.repository.js';
import { ICreateProductPayload, IProduct, IProductQueryParams, IProductWithCatagory, IUpdateProductPayload } from '../types/product.types.js';
import { AppError } from '../utils/appError.js';
import { ProductRepository } from './../repositories/product.repository.js';



export class ProductService {
    private productRepository: ProductRepository;
    private catagoryRepository: CatagoryRepository;

    constructor(){
    this.productRepository = new ProductRepository();
    this.catagoryRepository = new CatagoryRepository(); 
    }

    async createProduct(payload: ICreateProductPayload): Promise<IProduct> {
        const catagory = await this.catagoryRepository.findById(payload.catagory_id);

        if(!catagory){
            throw new AppError(`cant create product, catagory not found`, 404);
        }
        return await this.productRepository.create(payload);
    }


    async getAllProduct (params: IProductQueryParams): Promise<{ products: IProductWithCatagory[]; meta: {page:number, limit:number, total:number, totalPages: number}}>{
        const page = params.page && params.page > 0 ? params.page : 1;
        const limit = params.limit && params.limit > 0 ? params.limit : 10;

        const {products, total} = await this.productRepository.findAll({...params, page, limit,});
        const totalPages = Math.ceil(total / limit);

        return {products, meta: {page, limit, total, totalPages}};

    }
     
    async getProductById(id: number): Promise<IProductWithCatagory> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError(`Product with ID ${id} not found`, 404);
    }
    return product;
  }



  async updateProduct(
    id: number,
    payload: IUpdateProductPayload
  ): Promise<IProduct> {

    await this.getProductById(id);


    if (payload.catagory_id !== undefined) {
      const catagory = await this.catagoryRepository.findById(payload.catagory_id);
      if (!catagory) {
        throw new AppError(
          `Catagory with ID ${payload.catagory_id} does not exist`,
          404
        );
      }
    }
    const updatedProduct = await this.productRepository.update(id, payload);
    if (!updatedProduct) {
      throw new AppError('No changes applied to the product', 400);
    }

    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.getProductById(id);

    const isDeleted = await this.productRepository.delete(id);
    if (!isDeleted) {
      throw new AppError(`Failed to delete product with ID ${id}`, 500);
    }
  }


}

