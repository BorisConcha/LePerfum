import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PerfumeService } from '../../services/perfume.service';
import { Perfume, PerfumeRequest } from '../../models/perfume.model';

@Component({
  selector: 'app-perfume-list',
  templateUrl: './perfume-list.component.html',
  styleUrls: ['./perfume-list.component.css']
})
export class PerfumeListComponent implements OnInit, OnDestroy {
  perfumes: Perfume[] = [];
  filteredPerfumes: Perfume[] = [];
  selectedPerfume: Perfume | null = null;
  perfumeForm: FormGroup;
  searchTerm: string = '';
  selectedCategory: string = '';
  isEditing: boolean = false;
  showForm: boolean = false;
  loading: boolean = false;
  error: string = '';

  private destroy$ = new Subject<void>();

  categorias = ['Masculino', 'Femenino', 'Unisex'];

  constructor(
    private perfumeService: PerfumeService,
    private fb: FormBuilder
  ) {
    this.perfumeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadPerfumes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['', Validators.required],
      imagen: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // GET - Cargar todos los perfumes
  loadPerfumes(): void {
    this.loading = true;
    this.error = '';
    
    this.perfumeService.getPerfumes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (perfumes) => {
          this.perfumes = perfumes;
          this.filteredPerfumes = perfumes;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar los perfumes';
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }

  // POST - Crear nuevo perfume
  createPerfume(): void {
    if (this.perfumeForm.valid) {
      this.loading = true;
      const perfumeData: PerfumeRequest = this.perfumeForm.value;

      this.perfumeService.createPerfume(perfumeData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newPerfume) => {
            this.resetForm();
            this.showForm = false;
            this.loading = false;
            console.log('Perfume creado:', newPerfume);
          },
          error: (error) => {
            this.error = 'Error al crear el perfume';
            this.loading = false;
            console.error('Error:', error);
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  // PUT - Actualizar perfume existente
  updatePerfume(): void {
    if (this.perfumeForm.valid && this.selectedPerfume) {
      this.loading = true;
      const perfumeData: Partial<PerfumeRequest> = this.perfumeForm.value;

      this.perfumeService.updatePerfume(this.selectedPerfume.id, perfumeData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedPerfume) => {
            this.resetForm();
            this.showForm = false;
            this.isEditing = false;
            this.selectedPerfume = null;
            this.loading = false;
            console.log('Perfume actualizado:', updatedPerfume);
          },
          error: (error) => {
            this.error = 'Error al actualizar el perfume';
            this.loading = false;
            console.error('Error:', error);
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  // DELETE - Eliminar perfume
  deletePerfume(perfume: Perfume): void {
    if (confirm(`¿Estás seguro de que deseas eliminar "${perfume.nombre}"?`)) {
      this.loading = true;

      this.perfumeService.deletePerfume(perfume.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            if (success) {
              this.loading = false;
              console.log('Perfume eliminado:', perfume.nombre);
            }
          },
          error: (error) => {
            this.error = 'Error al eliminar el perfume';
            this.loading = false;
            console.error('Error:', error);
          }
        });
    }
  }

  // Funciones de la interfaz
  openCreateForm(): void {
    this.resetForm();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(perfume: Perfume): void {
    this.selectedPerfume = perfume;
    this.isEditing = true;
    this.showForm = true;
    
    this.perfumeForm.patchValue({
      nombre: perfume.nombre,
      marca: perfume.marca,
      precio: perfume.precio,
      descripcion: perfume.descripcion,
      categoria: perfume.categoria,
      imagen: perfume.imagen,
      stock: perfume.stock
    });
  }

  closeForm(): void {
    this.resetForm();
    this.showForm = false;
    this.isEditing = false;
    this.selectedPerfume = null;
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updatePerfume();
    } else {
      this.createPerfume();
    }
  }

  // Búsqueda y filtrado
  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.perfumeService.searchPerfumes(this.searchTerm)
        .pipe(takeUntil(this.destroy$))
        .subscribe(results => {
          this.filteredPerfumes = results;
        });
    } else {
      this.filteredPerfumes = this.perfumes;
    }
  }

  onCategoryFilter(): void {
    if (this.selectedCategory) {
      this.perfumeService.getPerfumesByCategoria(this.selectedCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe(results => {
          this.filteredPerfumes = results;
        });
    } else {
      this.filteredPerfumes = this.perfumes;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.filteredPerfumes = this.perfumes;
  }

  // Funciones auxiliares
  private resetForm(): void {
    this.perfumeForm.reset();
    this.error = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.perfumeForm.controls).forEach(key => {
      this.perfumeForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.perfumeForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.perfumeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `${fieldName} debe ser mayor a ${field.errors['min'].min}`;
    }
    return '';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/default-perfume.jpg';
    }
  }
}

