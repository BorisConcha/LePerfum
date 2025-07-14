import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../models/user.model';

/**
 * Componente de navegación principal
 * Maneja el menú responsive y estado de usuario
 */
@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="fas fa-spray-can me-2"></i>LePerfum
        </a>

        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                Inicio
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/perfumes" routerLinkActive="active">
                Perfumes
              </a>
            </li>
            <li class="nav-item" *ngIf="isAuthenticated">
              <a class="nav-link" routerLink="/profile" routerLinkActive="active">
                Mi Perfil
              </a>
            </li>
            <li class="nav-item" *ngIf="isAdmin">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active">
                Admin
              </a>
            </li>
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="!isAuthenticated">
              <a class="nav-link" routerLink="/login">
                Iniciar Sesión
              </a>
            </li>
            <li class="nav-item" *ngIf="!isAuthenticated">
              <a class="nav-link" routerLink="/register">
                Registrarse
              </a>
            </li>
            <li class="nav-item dropdown" *ngIf="isAuthenticated">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-user-circle me-1"></i>
                {{ currentUser?.firstName }}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" routerLink="/profile">Mi Perfil</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" (click)="logout($event)">Cerrar Sesión</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isAuthenticated = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.isAdmin = user?.role === 'admin';
    });
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}