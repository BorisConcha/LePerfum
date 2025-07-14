export interface Perfume {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  descripcion: string;
  categoria: 'Masculino' | 'Femenino' | 'Unisex';
  imagen: string;
  stock: number;
  fechaCreacion: string;
  rating: number;
}

export interface PerfumeRequest {
  nombre: string;
  marca: string;
  precio: number;
  descripcion: string;
  categoria: 'Masculino' | 'Femenino' | 'Unisex';
  imagen: string;
  stock: number;
}

export interface ApiResponse {
  perfumes: Perfume[];
}
