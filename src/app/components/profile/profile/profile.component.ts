import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

/**
 * Componente de perfil de usuario
 * Permite ver y editar información personal
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  editMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.initForms();
    });
  }

  /**
   * Inicializa los formularios
   */
  private initForms(): void {
    this.profileForm = this.fb.group({
      firstName: [this.currentUser?.firstName || '', Validators.required],
      lastName: [this.currentUser?.lastName || '', Validators.required],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      phone: [this.currentUser?.phone || ''],
      address: [this.currentUser?.address || '']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    });
  }

  /**
   * Alterna el modo de edición
   */
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.initForms(); // Resetear formulario al cancelar
    }
  }

  /**
   * Verifica si un campo es inválido
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Maneja el envío del formulario de perfil
   */
  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      
      // Simular actualización
      setTimeout(() => {
        this.loading = false;
        this.editMode = false;
        alert('Perfil actualizado correctamente');
      }, 1000);
    }
  }

  /**
   * Maneja el cambio de contraseña
   */
  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      const { newPassword, confirmNewPassword } = this.passwordForm.value;
      
      if (newPassword !== confirmNewPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      // Simular cambio de contraseña
      alert('Contraseña cambiada correctamente');
      this.passwordForm.reset();
    }
  }

  /**
   * Obtiene el texto del rol
   */
  getRoleText(role?: string): string {
    return role === 'admin' ? 'Administrador' : 'Cliente';
  }

  /**
   * Formatea la fecha
   */
  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES');
  }
}