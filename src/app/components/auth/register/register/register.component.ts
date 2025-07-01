import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

/**
 * Validador personalizado para contraseñas seguras
 */
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;
    const hasMaxLength = value.length <= 20;

    const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && hasMinLength && hasMaxLength;

    return passwordValid ? null : {
      strongPassword: {
        hasNumber,
        hasUpper,
        hasLower,
        hasSpecial,
        hasMinLength,
        hasMaxLength
      }
    };
  };
}

/**
 * Componente de registro de usuarios
 * Incluye validaciones avanzadas de contraseña
 */
@Component({
  selector: 'app-register',
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h2>Crear Cuenta</h2>
                <p class="text-muted">Únete a LePerfum</p>
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">Nombre</label>
                    <input 
                      type="text" 
                      class="form-control"
                      [class.is-invalid]="isFieldInvalid('firstName')"
                      id="firstName" 
                      formControlName="firstName"
                      placeholder="Tu nombre">
                    <div class="invalid-feedback">
                      El nombre es requerido
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Apellido</label>
                    <input 
                      type="text" 
                      class="form-control"
                      [class.is-invalid]="isFieldInvalid('lastName')"
                      id="lastName" 
                      formControlName="lastName"
                      placeholder="Tu apellido">
                    <div class="invalid-feedback">
                      El apellido es requerido
                    </div>
                  </div>
                </div>

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
                    <div *ngIf="registerForm.get('email')?.errors?.['required']">
                      El correo es requerido
                    </div>
                    <div *ngIf="registerForm.get('email')?.errors?.['email']">
                      Formato de correo inválido
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="phone" class="form-label">Teléfono</label>
                  <input 
                    type="tel" 
                    class="form-control"
                    [class.is-invalid]="isFieldInvalid('phone')"
                    id="phone" 
                    formControlName="phone"
                    placeholder="+56 9 1234 5678">
                  <div class="invalid-feedback">
                    Formato de teléfono inválido
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
                  
                  <div class="password-requirements mt-2" *ngIf="registerForm.get('password')?.errors?.['strongPassword']">
                    <small class="text-muted">La contraseña debe contener:</small>
                    <ul class="list-unstyled small">
                      <li [class.text-success]="!registerForm.get('password')?.errors?.['strongPassword']?.hasMinLength" 
                          [class.text-danger]="registerForm.get('password')?.errors?.['strongPassword']?.hasMinLength">
                        ✓ Mínimo 8 caracteres
                      </li>
                      <li [class.text-success]="registerForm.get('password')?.errors?.['strongPassword']?.hasMaxLength" 
                          [class.text-danger]="!registerForm.get('password')?.errors?.['strongPassword']?.hasMaxLength">
                        ✓ Máximo 20 caracteres
                      </li>
                      <li [class.text-success]="registerForm.get('password')?.errors?.['strongPassword']?.hasNumber" 
                          [class.text-danger]="!registerForm.get('password')?.errors?.['strongPassword']?.hasNumber">
                        ✓ Al menos un número
                      </li>
                      <li [class.text-success]="registerForm.get('password')?.errors?.['strongPassword']?.hasUpper" 
                          [class.text-danger]="!registerForm.get('password')?.errors?.['strongPassword']?.hasUpper">
                        ✓ Al menos una mayúscula
                      </li>
                      <li [class.text-success]="registerForm.get('password')?.errors?.['strongPassword']?.hasLower" 
                          [class.text-danger]="!registerForm.get('password')?.errors?.['strongPassword']?.hasLower">
                        ✓ Al menos una minúscula
                      </li>
                      <li [class.text-success]="registerForm.get('password')?.errors?.['strongPassword']?.hasSpecial" 
                          [class.text-danger]="!registerForm.get('password')?.errors?.['strongPassword']?.hasSpecial">
                        ✓ Al menos un carácter especial
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control"
                    [class.is-invalid]="isFieldInvalid('confirmPassword')"
                    id="confirmPassword" 
                    formControlName="confirmPassword"
                    placeholder="Confirma tu contraseña">
                  <div class="invalid-feedback">
                    Las contraseñas no coinciden
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input 
                    type="checkbox" 
                    class="form-check-input"
                    [class.is-invalid]="isFieldInvalid('acceptTerms')"
                    id="acceptTerms"
                    formControlName="acceptTerms">
                  <label class="form-check-label" for="acceptTerms">
                    Acepto los <a href="#" class="text-decoration-none">términos y condiciones</a>
                  </label>
                  <div class="invalid-feedback">
                    Debes aceptar los términos y condiciones
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  [disabled]="registerForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
                </button>
              </form>

              <div class="text-center">
                <p class="mb-0">¿Ya tienes cuenta?</p>
                <a routerLink="/login" class="btn btn-outline-primary">
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
   * Inicializa el formulario con todas las validaciones
   */
  private initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[\d\s-()]+$/)]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador para verificar que las contraseñas coincidan
   */
  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  /**
   * Verifica si un campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      
      this.authService.register(this.registerForm.value).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          this.loading = false;
          alert('Error al registrar usuario');
        }
      });
    }
  }
}
