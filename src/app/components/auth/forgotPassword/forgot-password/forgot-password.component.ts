import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Componente para recuperación de contraseña
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  
  // Propiedades del componente
  forgotPasswordForm!: FormGroup;
  loading = false;
  emailSent = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */
  private initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Verifica si un campo es inválido y ha sido tocado
   * @param fieldName - Nombre del campo a validar
   * @returns true si el campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Maneja el envío del formulario de recuperación
   * En un proyecto real, aquí llamarías a un servicio para enviar el correo
   */
  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      
      // Simular llamada a API para envío de correo
      // TODO: Reemplazar con llamada real a servicio
      setTimeout(() => {
        this.loading = false;
        this.emailSent = true;
        console.log('Email enviado a:', this.forgotPasswordForm.get('email')?.value);
      }, 2000);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  /**
   * Reinicia el formulario para enviar a otro correo
   * Permite al usuario ingresar un nuevo email
   */
  resetForm(): void {
    this.emailSent = false;
    this.forgotPasswordForm.reset();
    this.loading = false;
  }

  /**
   * Getter para acceder fácilmente al control del email
   */
  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }
}