import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

/**
 * Servicio de autenticación
 * Maneja el login, registro y estado de autenticación del usuario
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Cargar usuario desde localStorage si existe
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * Inicia sesión de usuario
   */
  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Simulación de autenticación
      setTimeout(() => {
        if (email && password.length >= 6) {
          const user: User = {
            id: '1',
            email,
            firstName: 'Usuario',
            lastName: 'Demo',
            role: email.includes('admin') ? 'admin' : 'customer',
            createdAt: new Date()
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Registra un nuevo usuario
   */
  register(userData: any): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          ...userData,
          role: 'customer',
          createdAt: new Date()
        };
        
        // Simular registro exitoso
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}
