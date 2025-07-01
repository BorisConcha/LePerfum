export interface Perfume {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  category: 'masculine' | 'feminine' | 'unisex';
  fragrance: string[];
  inStock: boolean;
  rating: number;
}
