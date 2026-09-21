export type Category = 'Todo' | 'Mujer' | 'Hombre' | 'Niños' | 'Casa' | 'Bienestar';

export type Product = {
  id: number;
  name: string;
  category: Exclude<Category, 'Todo'>;
  price: number;
  oldPrice?: number;
  stock?: number;
  tag?: string;
  tone: string;
  accent: string;
  visual: 'bag' | 'shirt' | 'vase' | 'sneaker' | 'serum' | 'lamp' | 'cap' | 'shorts';
  description: string;
  dimensions?: string;
  weight?: string;
};

export type CartItem = { 
  product: Product; 
  quantity: number 
};

export type User = { 
  id?: number; 
  name: string; 
  email: string; 
  phone?: string; 
  address?: string; 
  city?: string; 
  role: 'admin' | 'customer' 
};
