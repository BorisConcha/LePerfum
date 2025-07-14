import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PerfumeService } from '../../../services/perfume.service';
import { Perfume } from '../../../models/perfume.model';

/**
 * Componente de página principal
 * Muestra perfumes destacados y información de la tienda
 */
@Component({
  selector: 'app-home',
  template: `
    <div class="main-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Descubre tu fragancia perfecta</h1>
          <p class="hero-subtitle">
            Explora nuestra exclusiva colección de perfumes de las mejores marcas del mundo. 
            Desde fragancias clásicas hasta las últimas tendencias.
          </p>
          
          <div class="hero-buttons">
            <a routerLink="/perfumes" class="hero-btn primary">Ver Catálogo</a>
            <a routerLink="/register" class="hero-btn">Únete Ahora</a>
          </div>
        </div>
      </section>

      <section class="why-choose-section">
        <div class="container">
          <h2 class="section-title">¿Por qué elegir LePerfum?</h2>
          <p class="section-subtitle">
            La mejor experiencia en perfumes online
          </p>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-shipping-fast"></i>
              </div>
              <h4 class="feature-title">Envío Rápido</h4>
              <p class="feature-description">
                Entrega en 24-48 horas en toda la región metropolitana
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-award"></i>
              </div>
              <h4 class="feature-title">Productos Originales</h4>
              <p class="feature-description">
                100% originales con garantía de autenticidad
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-headset"></i>
              </div>
              <h4 class="feature-title">Atención 24/7</h4>
              <p class="feature-description">
                Soporte personalizado cuando lo necesites
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="main-section">
        <div class="container">
          <h2 class="section-title">Perfumes Destacados</h2>
          <p class="section-subtitle">
            Los favoritos de nuestros clientes
          </p>
          
          <div class="products-grid" *ngIf="featuredPerfumes.length > 0">
            <div class="product-card" *ngFor="let perfume of featuredPerfumes">
              <div class="product-image">
                <img 
                  [src]="perfume.imagen" 
                  [alt]="perfume.nombre">
              </div>
              <div class="product-info">
                <h5 class="product-title">{{ perfume.nombre }}</h5>
                <p class="product-brand">{{ perfume.marca }}</p>
                <p class="product-price">{{ perfume.precio }}</p>
                
                <div class="product-actions">
                  <div class="product-rating">
                    <i class="fas fa-star" *ngFor="let star of getStars(perfume.rating)"></i>
                    <span class="rating-text">{{ perfume.rating }}</span>
                  </div>
                  <button class="btn btn-primary">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="featuredPerfumes.length === 0" class="loading">
            <div class="spinner"></div>
          </div>
        </div>
      </section>

      <section class="hero-section" style="padding: 60px 0;">
        <div class="container">
          <div class="hero-content">
            <h2 class="hero-title" style="font-size: 2.5rem;">Mantente al día</h2>
            <p class="hero-subtitle">
              Suscríbete a nuestro newsletter y recibe ofertas exclusivas y noticias sobre nuevas fragancias
            </p>
            
            <div class="search-container">
              <form class="search-form">
                <input 
                  type="email" 
                  class="search-input"
                  placeholder="Tu correo electrónico">
                <button type="submit" class="search-btn">
                  Suscribirse
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
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
    this.perfumeService.getPerfumes().subscribe(perfumes => {
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