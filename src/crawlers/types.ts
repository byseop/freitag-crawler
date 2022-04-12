export interface Product {
  id: string;
  name: string;
  url: string;
  cover: string;
}

export interface ProductList {
  collectDate: string;
  price: string;
  data: Product[];
}
