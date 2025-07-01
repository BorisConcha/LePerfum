import { Component, OnInit } from '@angular/core';
import { PerfumeService } from '../../../services/perfume.service';
import { Perfume } from '../../../models/perfume.model';

/**
 * Componente de página principal
 * Muestra perfumes destacados y información de la tienda
 */
@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section bg-gradient text-white py-5">
        <div class="container">
          <div class="row align-items-center min-vh-50">
            <div class="col-12 col-lg-6">
              <h1 class="display-4 fw-bold mb-4">
                Descubre tu fragancia perfecta
              </h1>
              <p class="lead mb-4">
                Explora nuestra exclusiva colección de perfumes de las mejores marcas del mundo. 
                Desde fragancias clásicas hasta las últimas tendencias.
              </p>
              <div class="d-flex flex-column flex-sm-row gap-3">
                <a routerLink="/perfumes" class="btn btn-light btn-lg">
                  Ver Catálogo
                </a>
                <a routerLink="/register" class="btn btn-outline-light btn-lg">
                  Únete Ahora
                </a>
              </div>
            </div>
            <div class="col-12 col-lg-6 text-center">
              <img 
                src="https://via.placeholder.com/500x400?text=Luxury+Perfumes" 
                alt="Perfumes de lujo" 
                class="img-fluid rounded shadow">
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-5">
        <div class="container">
          <div class="row text-center mb-5">
            <div class="col-12">
              <h2 class="h1 mb-4">¿Por qué elegir LePerfum?</h2>
              <p class="lead text-muted">
                La mejor experiencia en perfumes online
              </p>
            </div>
          </div>
          
          <div class="row g-4">
            <div class="col-12 col-md-4">
              <div class="card border-0 h-100 text-center">
                <div class="card-body p-4">
                  <div class="feature-icon mb-3">
                    <i class="fas fa-shipping-fast fa-3x text-primary"></i>
                  </div>
                  <h4>Envío Rápido</h4>
                  <p class="text-muted">
                    Entrega en 24-48 horas en toda la región metropolitana
                  </p>
                </div>
              </div>
            </div>
            
            <div class="col-12 col-md-4">
              <div class="card border-0 h-100 text-center">
                <div class="card-body p-4">
                  <div class="feature-icon mb-3">
                    <i class="fas fa-award fa-3x text-primary"></i>
                  </div>
                  <h4>Productos Originales</h4>
                  <p class="text-muted">
                    100% originales con garantía de autenticidad
                  </p>
                </div>
              </div>
            </div>
            
            <div class="col-12 col-md-4">
              <div class="card border-0 h-100 text-center">
                <div class="card-body p-4">
                  <div class="feature-icon mb-3">
                    <i class="fas fa-headset fa-3x text-primary"></i>
                  </div>
                  <h4>Atención 24/7</h4>
                  <p class="text-muted">
                    Soporte personalizado cuando lo necesites
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="py-5 bg-light">
        <div class="container">
          <div class="row mb-5">
            <div class="col-12 text-center">
              <h2 class="h1 mb-4">Perfumes Destacados</h2>
              <p class="lead text-muted">
                Los favoritos de nuestros clientes
              </p>
            </div>
          </div>
          
          <div class="row g-4" *ngIf="featuredPerfumes.length > 0">
            <div class="col-12 col-sm-6 col-lg-4" *ngFor="let perfume of featuredPerfumes">
              <div class="card h-100 shadow-sm">
                <img 
                  [src]="perfume.image" 
                  [alt]="perfume.name"
                  class="card-img-top"
                  style="height: 250px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ perfume.name }}</h5>
                  <p class="text-muted mb-2">{{ perfume.brand }}</p>
                  <p class="card-text flex-grow-1">{{ perfume.description }}</p>
                  
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="price">
                      <span class="h5 text-primary fw-bold">\${{ perfume.price }}</span>
                    </div>
                    <div class="rating">
                      <span class="text-warning">
                        <i class="fas fa-star" *ngFor="let star of getStars(perfume.rating)"></i>
                      </span>
                      <small class="text-muted ms-1">{{ perfume.rating }}</small>
                    </div>
                  </div>
                  
                  <button class="btn btn-primary mt-3">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="py-5 bg-primary text-white">
        <div class="container">
          <div class="row justify-content-center text-center">
            <div class="col-12 col-lg-8">
              <h2 class="h1 mb-4">Mantente al día</h2>
              <p class="lead mb-4">
                Suscríbete a nuestro newsletter y recibe ofertas exclusivas y noticias sobre nuevas fragancias
              </p>
              
              <form class="row g-3 justify-content-center">
                <div class="col-12 col-md-6">
                  <input 
                    type="email" 
                    class="form-control form-control-lg"
                    placeholder="Tu correo electrónico">
                </div>
                <div class="col-12 col-md-auto">
                  <button type="submit" class="btn btn-light btn-lg">
                    Suscribirse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .bg-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .min-vh-50 {
      min-height: 50vh;
    }
    .feature-icon {
      margin-bottom: 1rem;
    }
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredPerfumes: Perfume[] = [];

  constructor(private perfumeService: PerfumeService) {}

  ngOnInit(): void {
    this.loadFeaturedPerfumes();
  }

  /**
   * Carga los perfumes destacados
   */
  private loadFeaturedPerfumes(): void {
    this.perfumeService.getAllPerfumes().subscribe(perfumes => {
      this.featuredPerfumes = perfumes.slice(0, 3);
    });
  }

  /**
   * Genera array de estrellas para rating
   */
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}