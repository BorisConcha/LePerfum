import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Perfume {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  descripcion: string;
  imagen: string;
  categoria: string;
  stock: number;
  rating: number;
  esNuevo?: boolean;
  enOferta?: boolean;
  descuento?: number;
}

@Component({
  selector: 'app-perfume-list',
  templateUrl: './perfume-list.component.html',
  styleUrls: ['./perfume-list.component.css']
})
export class PerfumeListComponent implements OnInit {
  perfumes: Perfume[] = [
    {
      id: 1,
      nombre: 'Chanel No. 5',
      marca: 'Chanel',
      precio: 89990,
      descripcion: 'Fragancia icónica y atemporal con notas florales',
      imagen: 'assets/images/chanel-no5.jpg',
      categoria: 'Femenino',
      stock: 15,
      rating: 4.8,
      esNuevo: false,
      enOferta: true,
      descuento: 15
    },
    {
      id: 2,
      nombre: 'Sauvage',
      marca: 'Dior',
      precio: 79990,
      descripcion: 'Fragancia masculina fresca y sofisticada',
      imagen: 'assets/images/dior-sauvage.jpg',
      categoria: 'Masculino',
      stock: 22,
      rating: 4.7,
      esNuevo: true,
      enOferta: false
    },
    {
      id: 3,
      nombre: 'Good Girl',
      marca: 'Carolina Herrera',
      precio: 65990,
      descripcion: 'Fragancia femenina dulce y seductora',
      imagen: 'assets/images/good-girl.jpg',
      categoria: 'Femenino',
      stock: 8,
      rating: 4.6,
      esNuevo: false,
      enOferta: true,
      descuento: 20
    },
    {
      id: 4,
      nombre: 'Acqua di Gio',
      marca: 'Armani',
      precio: 72990,
      descripcion: 'Fragancia masculina acuática y refrescante',
      imagen: 'assets/images/acqua-di-gio.jpg',
      categoria: 'Masculino',
      stock: 18,
      rating: 4.5,
      esNuevo: false,
      enOferta: false
    },
    {
      id: 5,
      nombre: 'Black Opium',
      marca: 'Yves Saint Laurent',
      precio: 68990,
      descripcion: 'Fragancia femenina intensa y adictiva',
      imagen: 'assets/images/black-opium.jpg',
      categoria: 'Femenino',
      stock: 12,
      rating: 4.9,
      esNuevo: true,
      enOferta: false
    },
    {
      id: 6,
      nombre: 'Bleu de Chanel',
      marca: 'Chanel',
      precio: 85990,
      descripcion: 'Fragancia masculina elegante y moderna',
      imagen: 'assets/images/bleu-chanel.jpg',
      categoria: 'Masculino',
      stock: 10,
      rating: 4.8,
      esNuevo: false,
      enOferta: true,
      descuento: 10
    }
  ];

  perfumesFiltrados: Perfume[] = [];
  filtroCategoria: string = 'Todos';
  filtroMarca: string = 'Todas';
  ordenarPor: string = 'nombre';
  terminoBusqueda: string = '';
  
  categorias: string[] = ['Todos', 'Masculino', 'Femenino'];
  marcas: string[] = ['Todas', 'Chanel', 'Dior', 'Carolina Herrera', 'Armani', 'Yves Saint Laurent'];
  opcionesOrden: any[] = [
    { valor: 'nombre', texto: 'Nombre A-Z' },
    { valor: 'precio-asc', texto: 'Precio: Menor a Mayor' },
    { valor: 'precio-desc', texto: 'Precio: Mayor a Menor' },
    { valor: 'rating', texto: 'Mejor Valorados' }
  ];

  // Variables para carrito
  carrito: any[] = [];
  mostrarCarrito: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.aplicarFiltros();
    this.cargarCarrito();
  }

  /**
   * Aplica todos los filtros y ordenamiento a la lista de perfumes
   */
  aplicarFiltros(): void {
    let perfumesFiltrados = [...this.perfumes];

    // Filtro por categoría
    if (this.filtroCategoria !== 'Todos') {
      perfumesFiltrados = perfumesFiltrados.filter(p => p.categoria === this.filtroCategoria);
    }

    // Filtro por marca
    if (this.filtroMarca !== 'Todas') {
      perfumesFiltrados = perfumesFiltrados.filter(p => p.marca === this.filtroMarca);
    }

    // Filtro por búsqueda
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      perfumesFiltrados = perfumesFiltrados.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.marca.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino)
      );
    }

    // Ordenamiento
    if (this.ordenarPor === 'nombre') {
      perfumesFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.ordenarPor === 'precio') {
      perfumesFiltrados.sort((a, b) => a.precio - b.precio);
    }

    this.perfumesFiltrados = perfumesFiltrados;
  }

  /**
   * Ordena los perfumes según el criterio seleccionado
   */
  ordenarPerfumes(perfumes: Perfume[]): void {
    switch (this.ordenarPor) {
      case 'nombre':
        perfumes.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'precio-asc':
        perfumes.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        perfumes.sort((a, b) => b.precio - a.precio);
        break;
      case 'rating':
        perfumes.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  /**
   * Calcula el precio con descuento si aplica
   */
  obtenerPrecioConDescuento(perfume: Perfume): number {
    if (perfume.enOferta && perfume.descuento) {
      return perfume.precio * (1 - perfume.descuento / 100);
    }
    return perfume.precio;
  }

  /**
   * Agrega un perfume al carrito
   */
  agregarAlCarrito(perfume: Perfume): void {
    const itemExistente = this.carrito.find(item => item.id === perfume.id);
    
    if (itemExistente) {
      if (itemExistente.cantidad < perfume.stock) {
        itemExistente.cantidad++;
      } else {
        alert('Stock insuficiente');
        return;
      }
    } else {
      this.carrito.push({
        ...perfume,
        cantidad: 1,
        precioUnitario: this.obtenerPrecioConDescuento(perfume)
      });
    }
    
    this.guardarCarrito();
    alert('Producto agregado al carrito');
  }

  /**
   * Elimina un item del carrito
   */
  eliminarDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
    this.guardarCarrito();
  }

  /**
   * Actualiza la cantidad de un item en el carrito
   */
  actualizarCantidad(index: number, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.eliminarDelCarrito(index);
      return;
    }
    
    const item = this.carrito[index];
    const perfume = this.perfumes.find(p => p.id === item.id);
    
    if (perfume && nuevaCantidad <= perfume.stock) {
      item.cantidad = nuevaCantidad;
      this.guardarCarrito();
    } else {
      alert('Stock insuficiente');
    }
  }

  /**
   * Calcula el total del carrito
   */
  obtenerTotalCarrito(): number {
    return this.carrito.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
  }

  /**
   * Obtiene la cantidad total de items en el carrito
   */
  obtenerCantidadTotalCarrito(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad, 0);
  }

  /**
   * Procede al checkout
   */
  procederAlCheckout(): void {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    // Aquí podrías navegar a una página de checkout
    // this.router.navigate(['/checkout']);
    alert('Redirigiendo al proceso de pago...');
  }

  /**
   * Vacía el carrito
   */
  vaciarCarrito(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.carrito = [];
      this.guardarCarrito();
    }
  }

  /**
   * Guarda el carrito en localStorage
   */
  private guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  /**
   * Carga el carrito desde localStorage
   */
  private cargarCarrito(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    }
  }

  /**
   * Genera un array de estrellas para mostrar el rating
   */
  obtenerEstrellas(rating: number): boolean[] {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(i <= rating);
    }
    return estrellas;
  }

  /**
   * Formatea el precio en formato chileno
   */
  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  }
}
