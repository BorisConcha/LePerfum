import { Component } from '@angular/core';

/**
 * Componente principal de la aplicación de perfumes
 * Maneja la estructura general y navegación de la aplicación
 */
@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .main-content {
      flex: 1;
      padding-top: 70px;
    }
  `]
})
export class AppComponent {
  title = 'LePerfum';
}