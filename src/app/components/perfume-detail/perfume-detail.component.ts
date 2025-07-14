import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PerfumeService } from '../../services/perfume.service';
import { Perfume } from '../../models/perfume.model';

@Component({
  selector: 'app-perfume-detail',
  templateUrl: './perfume-detail.component.html',
  styleUrls: ['./perfume-detail.component.css']
})
export class PerfumeDetailComponent implements OnInit, OnDestroy {
  perfume: Perfume | null = null;
  loading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private perfumeService: PerfumeService
  ) {}

  ngOnInit(): void {
    this.loadPerfume();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPerfume(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (id) {
        this.perfumeService.getPerfumeById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (perfume) => {
            if (perfume) {
                this.perfume = perfume;
            } else {
                this.error = 'Perfume no encontrado';
            }
            this.loading = false;
            },
            error: (error) => {
            this.error = 'Error al cargar el perfume';
            this.loading = false;
            console.error('Error:', error);
            }
        });
        setTimeout(() => {
            this.perfume = {
            id: +id,
            nombre: 'Perfume de ejemplo',
            marca: 'Marca ejemplo',
            precio: 50.00,
            categoria: 'Unisex',
            stock: 15,
            imagen: 'assets/images/default-perfume.jpg',
            descripcion: 'Descripción del perfume de ejemplo',
            fechaCreacion: "2024-01-15",
            rating: 5
            };
            this.loading = false;
        }, 1000);
    } else {
      this.error = 'ID de perfume no válido';
      this.loading = false;
    }

  }

    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        if (target) {
          target.src = 'assets/images/default-perfume.jpg';
        }
    }

  goBack(): void {
    this.router.navigate(['/perfumes']);
  }

  deletePerfume(): void {
    if (this.perfume && confirm(`¿Estás seguro de que deseas eliminar "${this.perfume.nombre}"?`)) {
      this.perfumeService.deletePerfume(this.perfume.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/perfumes']);
          },
          error: (error) => {
            this.error = 'Error al eliminar el perfume';
            console.error('Error:', error);
          }
        });
    }
  }
}