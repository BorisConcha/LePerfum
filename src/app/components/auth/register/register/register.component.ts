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

    // Siempre devolvemos el estado de cada validación para mostrar el feedback visual
    const validationState = {
      hasNumber,
      hasUpper,
      hasLower,
      hasSpecial,
      hasMinLength,
      hasMaxLength
    };

    return passwordValid ? null : {
      strongPassword: validationState
    };
  };
}

/**
 * Componente de registro de usuarios
 * Incluye validaciones avanzadas de contraseña
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false; // Nueva propiedad para controlar si se ha enviado el formulario

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
  private passwordMatchValidator = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      // Solo establecer el error en confirmPassword si tiene valor
      const confirmPasswordControl = form.get('confirmPassword');
      if (confirmPasswordControl && confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      }
      return { passwordMismatch: true };
    } else {
      // Limpiar el error de passwordMismatch si las contraseñas coinciden
      const confirmPasswordControl = form.get('confirmPassword');
      if (confirmPasswordControl && confirmPasswordControl.errors?.['passwordMismatch']) {
        delete confirmPasswordControl.errors['passwordMismatch'];
        if (Object.keys(confirmPasswordControl.errors).length === 0) {
          confirmPasswordControl.setErrors(null);
        }
      }
    }
    
    return null;
  }

  /**
   * Verifica si un campo es inválido y debe mostrar el error
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  /**
   * Verifica si debe mostrar un error específico para un campo
   */
  shouldShowError(fieldName: string, errorType: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.errors?.[errorType] && (field.dirty || field.touched || this.submitted));
  }

  /**
   * Obtiene los errores de la validación de contraseña fuerte
   */
  getPasswordErrors(): any {
    const passwordControl = this.registerForm.get('password');
    if (!passwordControl?.value) {
      // Si no hay valor, devolvemos un objeto con todos false
      return {
        hasNumber: false,
        hasUpper: false,
        hasLower: false,
        hasSpecial: false,
        hasMinLength: false,
        hasMaxLength: false
      };
    }
    
    // Si hay errores de strongPassword, los devolvemos
    if (passwordControl.errors?.['strongPassword']) {
      return passwordControl.errors['strongPassword'];
    }
    
    // Si no hay errores, significa que todos los criterios se cumplen
    return {
      hasNumber: true,
      hasUpper: true,
      hasLower: true,
      hasSpecial: true,
      hasMinLength: true,
      hasMaxLength: true
    };
  }

  /**
   * Verifica si debe mostrar las reglas de contraseña
   */
  shouldShowPasswordRules(): boolean {
    const passwordControl = this.registerForm.get('password');
    return !!(passwordControl && passwordControl.value && (passwordControl.dirty || passwordControl.touched || this.submitted));
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    this.submitted = true; // Marcar como enviado para mostrar errores
    
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
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched();
    }
  }

  /**
   * Marca todos los campos del formulario como touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Resetea el estado de envío del formulario
   */
  resetSubmitted(): void {
    this.submitted = false;
  }
}