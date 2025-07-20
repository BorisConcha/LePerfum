import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Perfume, PerfumeRequest, ApiResponse } from '../models/perfume.model';

@Injectable({
  providedIn: 'root'
})
export class PerfumeService {
  // private readonly JSON_URL = 'assets/data/perfumes.json';
  private readonly JSON_URL = 'https://borisconcha.github.io/json-perfumes-api/perfumes.json';
  private perfumesSubject = new BehaviorSubject<Perfume[]>([]);
  private nextId = 6;

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  // Cargar datos iniciales del JSON
  private loadInitialData(): void {
    this.http.get<ApiResponse>(this.JSON_URL)
      .pipe(
        map(response => response.perfumes),
        catchError(error => {
          console.error('Error cargando datos iniciales:', error);
          return throwError(() => error);
        })
      )
      .subscribe(perfumes => {
        this.perfumesSubject.next(perfumes);
        // Actualizar nextId basado en los datos existentes
        const maxId = Math.max(...perfumes.map(p => p.id));
        this.nextId = maxId + 1;
      });
  }

  // GET - Obtener todos los perfumes
  getPerfumes(): Observable<Perfume[]> {
    return this.perfumesSubject.asObservable();
  }

  // GET - Obtener perfume por ID
  getPerfumeById(id: number): Observable<Perfume | undefined> {
    return this.perfumesSubject.pipe(
      map(perfumes => perfumes.find(p => p.id === id))
    );
  }

  // GET - Buscar perfumes por categoría
  getPerfumesByCategoria(categoria: string): Observable<Perfume[]> {
    return this.perfumesSubject.pipe(
      map(perfumes => perfumes.filter(p => p.categoria === categoria))
    );
  }

  // POST - Crear nuevo perfume
  createPerfume(perfumeData: PerfumeRequest): Observable<Perfume> {
    return new Observable(observer => {
      try {
        const newPerfume: Perfume = {
          id: this.nextId++,
          ...perfumeData,
          fechaCreacion: new Date().toISOString().split('T')[0],
          rating: 0
        };

        const currentPerfumes = this.perfumesSubject.value;
        const updatedPerfumes = [...currentPerfumes, newPerfume];
        this.perfumesSubject.next(updatedPerfumes);

        observer.next(newPerfume);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  // PUT - Actualizar perfume existente
  updatePerfume(id: number, perfumeData: Partial<PerfumeRequest>): Observable<Perfume> {
    return new Observable(observer => {
      try {
        const currentPerfumes = this.perfumesSubject.value;
        const perfumeIndex = currentPerfumes.findIndex(p => p.id === id);

        if (perfumeIndex === -1) {
          observer.error(new Error(`Perfume con ID ${id} no encontrado`));
          return;
        }

        const updatedPerfume: Perfume = {
          ...currentPerfumes[perfumeIndex],
          ...perfumeData
        };

        const updatedPerfumes = [...currentPerfumes];
        updatedPerfumes[perfumeIndex] = updatedPerfume;
        this.perfumesSubject.next(updatedPerfumes);

        observer.next(updatedPerfume);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  // DELETE - Eliminar perfume
  deletePerfume(id: number): Observable<boolean> {
    return new Observable(observer => {
      try {
        const currentPerfumes = this.perfumesSubject.value;
        const perfumeIndex = currentPerfumes.findIndex(p => p.id === id);

        if (perfumeIndex === -1) {
          observer.error(new Error(`Perfume con ID ${id} no encontrado`));
          return;
        }

        const updatedPerfumes = currentPerfumes.filter(p => p.id !== id);
        this.perfumesSubject.next(updatedPerfumes);

        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  // Método auxiliar para búsqueda
  searchPerfumes(term: string): Observable<Perfume[]> {
    return this.perfumesSubject.pipe(
      map(perfumes => 
        perfumes.filter(p => 
          p.nombre.toLowerCase().includes(term.toLowerCase()) ||
          p.marca.toLowerCase().includes(term.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  // Método para obtener estadísticas
  getEstadisticas(): Observable<any> {
    return this.perfumesSubject.pipe(
      map(perfumes => ({
        total: perfumes.length,
        stockTotal: perfumes.reduce((sum, p) => sum + p.stock, 0),
        precioPromedio: perfumes.reduce((sum, p) => sum + p.precio, 0) / perfumes.length,
        categorias: {
          masculino: perfumes.filter(p => p.categoria === 'Masculino').length,
          femenino: perfumes.filter(p => p.categoria === 'Femenino').length,
          unisex: perfumes.filter(p => p.categoria === 'Unisex').length
        }
      }))
    );
  }
}