import { Component } from '@angular/core';

/**
 * Componente principal de la aplicación de perfumes
 * Maneja la estructura general y navegación de la aplicación
 */
@Component({
  selector: 'app-root',
  template: `
    <div class="main-container">
      <app-navbar></app-navbar>
      <div class="content-wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'LePerfum';
}