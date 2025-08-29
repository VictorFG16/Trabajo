import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";


export interface Product {
  id: number;
  description: string;
  price: number;
  quantity: number;
  assignedDate: string;
  plantEntryDate: string;
  reference: string;
  brand: string;
  op: string;
  campaign: string;
  type: string;
  size: string;
  status?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private apiservice: ApiService) {}

    searchProducts(q: string) {
        return this.apiservice.get(`/products/search?q=${q}`);
    }

    getProducts() {
        return this.apiservice.get('/products');
    }

    getProductById(id: number) {
        return this.apiservice.get(`/products/${id}`);
    }

    createProduct(product: any) {
        return this.apiservice.post('/products', product);
    }

    updateProduct(id: number, product: any) {
        return this.apiservice.put(`/products/${id}`, product);
    }

    deleteProduct(id: number) {
        return this.apiservice.delete(`/products/${id}`);
    }
}
