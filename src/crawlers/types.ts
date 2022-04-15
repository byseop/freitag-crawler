export interface Product {
  id: string;
  name: string;
  url: string;
  cover: string;
  message?: string;
}

export interface ProductList {
  collectDate: string;
  price: string;
  data: Product[];
}
