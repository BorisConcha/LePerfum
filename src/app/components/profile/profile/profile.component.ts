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
  template: `
    <div class="container py-5">
      <div class="row">
        <div class="col-12 col-lg-4 mb-4">
          <div class="card">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="fas fa-user-circle fa-5x text-muted"></i>
              </div>
              <h4>{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h4>
              <p class="text-muted">{{ currentUser?.email }}</p>
              <span class="badge bg-primary">{{ getRoleText(currentUser?.role) }}</span>
              
              <div class="mt-4">
                <button 
                  class="btn btn-outline-primary w-100"
                  (click)="toggleEditMode()">
                  {{ editMode ? 'Cancelar' : 'Editar Perfil' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Información Personal</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" *ngIf="editMode">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">Nombre</label>
                    <input 
                      type="text" 
                      class="form-control"
                      [class.is-invalid]="isFieldInvalid('firstName')"
                      id="firstName" 
                      formControlName="firstName">
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
                      formControlName="lastName">
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
                    formControlName="email">
                  <div class="invalid-feedback">
                    <div *ngIf="profileForm.get('email')?.errors?.['required']">
                      El correo es requerido
                    </div>
                    <div *ngIf="profileForm.get('email')?.errors?.['email']">
                      Formato de correo inválido
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="phone" class="form-label">Teléfono</label>
                  <input 
                    type="tel" 
                    class="form-control"
                    id="phone" 
                    formControlName="phone">
                </div>

                <div class="mb-3">
                  <label for="address" class="form-label">Dirección</label>
                  <textarea 
                    class="form-control"
                    id="address" 
                    formControlName="address"
                    rows="3"></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="profileForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    (click)="toggleEditMode()">
                    Cancelar
                  </button>
                </div>
              </form>

              <!-- Vista de solo lectura -->
              <div *ngIf="!editMode">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <strong>Nombre:</strong>
                    <p class="mb-1">{{ currentUser?.firstName }}</p>
                  </div>
                  <div class="col-md-6 mb-3">
                    <strong>Apellido:</strong>
                    <p class="mb-1">{{ currentUser?.lastName }}</p>
                  </div>
                </div>
                <div class="mb-3">
                  <strong>Correo electrónico:</strong>
                  <p class="mb-1">{{ currentUser?.email }}</p>
                </div>
                <div class="mb-3">
                  <strong>Teléfono:</strong>
                  <p class="mb-1">{{ currentUser?.phone || 'No especificado' }}</p>
                </div>
                <div class="mb-3">
                  <strong>Dirección:</strong>
                  <p class="mb-1">{{ currentUser?.address || 'No especificada' }}</p>
                </div>
                <div class="mb-3">
                  <strong>Miembro desde:</strong>
                  <p class="mb-1">{{ formatDate(currentUser?.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de cambio de contraseña -->
          <div class="card mt-4">
            <div class="card-header">
              <h5 class="mb-0">Cambiar Contraseña</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()">
                <div class="mb-3">
                  <label for="currentPassword" class="form-label">Contraseña Actual</label>
                  <input 
                    type="password" 
                    class="form-control"
                    id="currentPassword" 
                    formControlName="currentPassword">
                </div>

                <div class="mb-3">
                  <label for="newPassword" class="form-label">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control"
                    id="newPassword" 
                    formControlName="newPassword">
                </div>

                <div class="mb-3">
                  <label for="confirmNewPassword" class="form-label">Confirmar Nueva Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control"
                    id="confirmNewPassword" 
                    formControlName="confirmNewPassword">
                </div>

                <button 
                  type="submit" 
                  class="btn btn-warning"
                  [disabled]="passwordForm.invalid">
                  Cambiar Contraseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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
