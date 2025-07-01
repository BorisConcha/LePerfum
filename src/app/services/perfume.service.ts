import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Perfume } from '../models/perfume.model';

/**
 * Servicio para la gestión de perfumes
 * Maneja las operaciones CRUD de perfumes
 */
@Injectable({
  providedIn: 'root'
})
export class PerfumeService {
  private perfumesSubject = new BehaviorSubject<Perfume[]>([]);
  public perfumes$ = this.perfumesSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  /**
   * Carga datos de ejemplo
   */
  private loadMockData(): void {
    const mockPerfumes: Perfume[] = [
      {
        id: '1',
        name: 'Chanel No. 5',
        brand: 'Chanel',
        description: 'Icónico perfume floral con notas de rosa y jazmín',
        price: 120,
        image: 'https://via.placeholder.com/300x400?text=Chanel+No.5',
        category: 'feminine',
        fragrance: ['Rosa', 'Jazmín', 'Sándalo'],
        inStock: true,
        rating: 4.8
      },
      {
        id: '2',
        name: 'Dior Sauvage',
        brand: 'Dior',
        description: 'Fragancia masculina fresca con bergamota',
        price: 95,
        image: 'https://via.placeholder.com/300x400?text=Dior+Sauvage',
        category: 'masculine',
        fragrance: ['Bergamota', 'Pimienta', 'Ambroxan'],
        inStock: true,
        rating: 4.6
      }
    ];
    
    this.perfumesSubject.next(mockPerfumes);
  }

  /**
   * Obtiene todos los perfumes
   */
  getAllPerfumes(): Observable<Perfume[]> {
    return this.perfumes$;
  }

  /**
   * Busca perfumes por término
   */
  searchPerfumes(term: string): Observable<Perfume[]> {
    return new Observable(observer => {
      const perfumes = this.perfumesSubject.value;
      const filtered = perfumes.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.brand.toLowerCase().includes(term.toLowerCase())
      );
      observer.next(filtered);
      observer.complete();
    });
  }
}
