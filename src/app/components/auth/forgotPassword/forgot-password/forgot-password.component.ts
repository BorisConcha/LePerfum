import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Componente para recuperación de contraseña
 */
@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h2>Recuperar Contraseña</h2>
                <p class="text-muted">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                </p>
              </div>

              <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" *ngIf="!emailSent">
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
                    <div *ngIf="forgotPasswordForm.get('email')?.errors?.['required']">
                      El correo es requerido
                    </div>
                    <div *ngIf="forgotPasswordForm.get('email')?.errors?.['email']">
                      Formato de correo inválido
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  [disabled]="forgotPasswordForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Enviando...' : 'Enviar Enlace' }}
                </button>
              </form>

              <div *ngIf="emailSent" class="text-center">
                <div class="alert alert-success">
                  <i class="fas fa-check-circle"></i>
                  <h5>Correo Enviado</h5>
                  <p class="mb-0">Hemos enviado un enlace de recuperación a tu correo electrónico.</p>
                </div>
                <button class="btn btn-outline-primary" (click)="resetForm()">
                  Enviar a otro correo
                </button>
              </div>

              <div class="text-center mt-3">
                <a routerLink="/login" class="text-decoration-none">
                  ← Volver al inicio de sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  emailSent = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario
   */
  private initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Verifica si un campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      
      // Simular envío de correo
      setTimeout(() => {
        this.loading = false;
        this.emailSent = true;
      }, 2000);
    }
  }

  /**
   * Reinicia el formulario para enviar a otro correo
   */
  resetForm(): void {
    this.emailSent = false;
    this.forgotPasswordForm.reset();
  }
}
