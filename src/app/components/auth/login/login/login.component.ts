import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

/**
 * Componente de inicio de sesión
 * Maneja la autenticación de usuarios con validaciones
 */
@Component({
  selector: 'app-login',
  template: `
    <div class="container-fluid">
      <div class="row min-vh-100">
        <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <div class="login-form w-100" style="max-width: 400px;">
            <div class="text-center mb-4">
              <h2>LePerfum</h2>
              <p class="text-muted">Inicia sesión en tu cuenta</p>
            </div>
            
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input 
                  type="email" 
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('email')"
                  id="email" 
                  formControlName="email"
                  placeholder="tu@email.com">
                <div class="invalid-feedback">
                  <div *ngIf="loginForm.get('email')?.errors?.['required']">
                    El correo es requerido
                  </div>
                  <div *ngIf="loginForm.get('email')?.errors?.['email']">
                    Formato de correo inválido
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input 
                  type="password" 
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('password')"
                  id="password" 
                  formControlName="password"
                  placeholder="Tu contraseña">
                <div class="invalid-feedback">
                  <div *ngIf="loginForm.get('password')?.errors?.['required']">
                    La contraseña es requerida
                  </div>
                  <div *ngIf="loginForm.get('password')?.errors?.['minlength']">
                    Mínimo 6 caracteres
                  </div>
                </div>
              </div>

              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="rememberMe">
                <label class="form-check-label" for="rememberMe">
                  Recordarme
                </label>
              </div>

              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                [disabled]="loginForm.invalid || loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
              </button>

              <div class="text-center">
                <a routerLink="/forgot-password" class="text-decoration-none">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </form>

            <hr class="my-4">
            <div class="text-center">
              <p class="mb-0">¿No tienes cuenta?</p>
              <a routerLink="/register" class="btn btn-outline-primary">
                Registrarse
              </a>
            </div>
          </div>
        </div>
        
        <div class="col-12 col-md-6 d-none d-md-block bg-light p-0">
          <div class="d-flex align-items-center justify-content-center h-100">
            <div class="text-center">
              <img 
                src="https://via.placeholder.com/400x300?text=Perfumes+Collection" 
                alt="Perfumes" 
                class="img-fluid rounded">
              <h3 class="mt-3">Descubre fragancias únicas</h3>
              <p class="text-muted">Los mejores perfumes del mundo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      min-height: 100vh;
    }
    .bg-light {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white;
    }
    .bg-light h3, .bg-light p {
      color: white;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Verifica si un campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.router.navigate(['/']);
          } else {
            alert('Credenciales inválidas');
          }
        },
        error: () => {
          this.loading = false;
          alert('Error al iniciar sesión');
        }
      });
    }
  }
}
