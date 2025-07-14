import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { PerfumeListComponent } from './perfume-list.component';
import { PerfumeService } from '../../services/perfume.service';
import { Perfume, PerfumeRequest } from '../../models/perfume.model';

describe('PerfumeListComponent', () => {
  let component: PerfumeListComponent;
  let fixture: ComponentFixture<PerfumeListComponent>;
  let mockPerfumeService: jasmine.SpyObj<PerfumeService>;

  // Mock data
  const mockPerfumes: Perfume[] = [
      {
        id: 1,
        nombre: 'Perfume Test 1',
        marca: 'Marca 1',
        precio: 50000,
        descripcion: 'Description 1',
        categoria: 'Unisex',
        imagen: 'default-perfume.webp',
        stock: 1,
        fechaCreacion: '01/01/2025',
        rating: 5
      },
      {
        id: 2,
        nombre: 'Perfume Test 2',
        marca: 'Marca 2',
        precio: 75000,
        descripcion: 'Description 2',
        categoria: 'Masculino',
        imagen: 'default-perfume.webp',
        stock: 2,
        fechaCreacion: '01/01/2025',
        rating: 5
      }
  ];

  const mockPerfumeRequest: PerfumeRequest = {
    nombre: 'Nuevo Perfume',
    marca: 'Nueva Marca',
    precio: 200,
    descripcion: 'Nueva descripción de prueba',
    categoria: 'Unisex',
    imagen: 'default-perfume.webp',
    stock: 15,
    fechaCreacion: '01/01/2025',
    rating: 5
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PerfumeService', [
      'getPerfumes',
      'createPerfume',
      'updatePerfume',
      'deletePerfume',
      'searchPerfumes',
      'getPerfumesByCategoria'
    ]);

    await TestBed.configureTestingModule({
      declarations: [PerfumeListComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: PerfumeService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfumeListComponent);
    component = fixture.componentInstance;
    mockPerfumeService = TestBed.inject(PerfumeService) as jasmine.SpyObj<PerfumeService>;
    
    // Configurar el mock para getPerfumes por defecto
    mockPerfumeService.getPerfumes.and.returnValue(of(mockPerfumes));
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.perfumes).toEqual([]);
      expect(component.filteredPerfumes).toEqual([]);
      expect(component.selectedPerfume).toBeNull();
      expect(component.searchTerm).toBe('');
      expect(component.selectedCategory).toBe('');
      expect(component.isEditing).toBeFalse();
      expect(component.showForm).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('');
    });

    it('should have correct categories', () => {
      expect(component.categorias).toEqual(['Masculino', 'Femenino', 'Unisex']);
    });

    it('should create form with correct structure', () => {
      expect(component.perfumeForm.get('nombre')).toBeDefined();
      expect(component.perfumeForm.get('marca')).toBeDefined();
      expect(component.perfumeForm.get('precio')).toBeDefined();
      expect(component.perfumeForm.get('descripcion')).toBeDefined();
      expect(component.perfumeForm.get('categoria')).toBeDefined();
      expect(component.perfumeForm.get('imagen')).toBeDefined();
      expect(component.perfumeForm.get('stock')).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should call loadPerfumes on init', () => {
      spyOn(component, 'loadPerfumes');
      component.ngOnInit();
      expect(component.loadPerfumes).toHaveBeenCalled();
    });
  });

  describe('loadPerfumes', () => {
    it('should load perfumes successfully', () => {
      component.loadPerfumes();
      
      expect(component.loading).toBeFalse();
      expect(component.perfumes).toEqual(mockPerfumes);
      expect(component.filteredPerfumes).toEqual(mockPerfumes);
      expect(component.error).toBe('');
    });

    it('should handle error when loading perfumes', () => {
      mockPerfumeService.getPerfumes.and.returnValue(throwError(() => new Error('Error')));
      
      component.loadPerfumes();
      
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('Error al cargar los perfumes');
    });
  });

  describe('createPerfume', () => {
    beforeEach(() => {
      component.perfumeForm.patchValue(mockPerfumeRequest);
    });

    it('should create perfume successfully when form is valid', () => {
      const newPerfume = { ...mockPerfumeRequest, id: 3 };
      mockPerfumeService.createPerfume.and.returnValue(of(newPerfume));
      spyOn(component, 'loadPerfumes'); // Spy en loadPerfumes
      
      component.createPerfume();
      
      expect(mockPerfumeService.createPerfume).toHaveBeenCalledWith(mockPerfumeRequest);
      expect(component.showForm).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('');
      expect(component.loadPerfumes).toHaveBeenCalled();
    });

    it('should handle error when creating perfume', () => {
      mockPerfumeService.createPerfume.and.returnValue(throwError(() => new Error('Error')));
      
      component.createPerfume();
      
      expect(component.error).toBe('Error al crear el perfume');
      expect(component.loading).toBeFalse();
    });

    it('should not create perfume when form is invalid', () => {
      component.perfumeForm.patchValue({ nombre: '' });
      
      component.createPerfume();
      
      expect(mockPerfumeService.createPerfume).not.toHaveBeenCalled();
      expect(component.perfumeForm.get('nombre')?.touched).toBeTrue();
    });
  });

  describe('updatePerfume', () => {
    beforeEach(() => {
      component.selectedPerfume = mockPerfumes[0];
      component.perfumeForm.patchValue(mockPerfumeRequest);
    });

    it('should update perfume successfully when form is valid and perfume is selected', () => {
      const updatedPerfume = { ...mockPerfumeRequest, id: 1 };
      mockPerfumeService.updatePerfume.and.returnValue(of(updatedPerfume));
      spyOn(component, 'loadPerfumes');
      
      component.updatePerfume();
      
      expect(mockPerfumeService.updatePerfume).toHaveBeenCalledWith(1, mockPerfumeRequest);
      expect(component.showForm).toBeFalse();
      expect(component.isEditing).toBeFalse();
      expect(component.selectedPerfume).toBeNull();
      expect(component.error).toBe('');
      expect(component.loadPerfumes).toHaveBeenCalled();
    });

    it('should handle error when updating perfume', () => {
      mockPerfumeService.updatePerfume.and.returnValue(throwError(() => new Error('Error')));
      
      component.updatePerfume();
      
      expect(component.error).toBe('Error al actualizar el perfume');
      expect(component.loading).toBeFalse();
    });

    it('should not update perfume when form is invalid', () => {
      component.perfumeForm.patchValue({ nombre: '' });
      
      component.updatePerfume();
      
      expect(mockPerfumeService.updatePerfume).not.toHaveBeenCalled();
      expect(component.perfumeForm.get('nombre')?.touched).toBeTrue();
    });
  });

  describe('deletePerfume', () => {
    it('should delete perfume when user confirms', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockPerfumeService.deletePerfume.and.returnValue(of(true));
      spyOn(component, 'loadPerfumes');
      
      component.deletePerfume(mockPerfumes[0]);
      
      expect(mockPerfumeService.deletePerfume).toHaveBeenCalledWith(1);
      expect(component.loading).toBeFalse();
      expect(component.loadPerfumes).toHaveBeenCalled();
    });

    it('should not delete perfume when user cancels', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.deletePerfume(mockPerfumes[0]);
      
      expect(mockPerfumeService.deletePerfume).not.toHaveBeenCalled();
    });

    it('should handle error when deleting perfume', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockPerfumeService.deletePerfume.and.returnValue(throwError(() => new Error('Error')));
      
      component.deletePerfume(mockPerfumes[0]);
      
      expect(component.error).toBe('Error al eliminar el perfume');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Form Management', () => {
    it('should open create form correctly', () => {
      component.openCreateForm();
      
      expect(component.isEditing).toBeFalse();
      expect(component.showForm).toBeTrue();
      expect(component.error).toBe('');
      expect(component.perfumeForm.pristine).toBeTrue();
    });

    it('should open edit form correctly', () => {
      component.openEditForm(mockPerfumes[0]);
      
      expect(component.selectedPerfume).toEqual(mockPerfumes[0]);
      expect(component.isEditing).toBeTrue();
      expect(component.showForm).toBeTrue();
      expect(component.perfumeForm.get('nombre')?.value).toBe(mockPerfumes[0].nombre);
    });

    it('should close form correctly', () => {
      component.closeForm();
      
      expect(component.showForm).toBeFalse();
      expect(component.isEditing).toBeFalse();
      expect(component.selectedPerfume).toBeNull();
      expect(component.error).toBe('');
      expect(component.perfumeForm.pristine).toBeTrue();
    });

    it('should call updatePerfume when editing on submit', () => {
      component.isEditing = true;
      spyOn(component, 'updatePerfume');
      
      component.onSubmit();
      
      expect(component.updatePerfume).toHaveBeenCalled();
    });

    it('should call createPerfume when not editing on submit', () => {
      component.isEditing = false;
      spyOn(component, 'createPerfume');
      
      component.onSubmit();
      
      expect(component.createPerfume).toHaveBeenCalled();
    });
  });

  describe('Search and Filter', () => {
    beforeEach(() => {
      component.perfumes = mockPerfumes;
      component.filteredPerfumes = mockPerfumes;
    });

    it('should search perfumes when search term is provided', () => {
      const searchResults = [mockPerfumes[0]];
      mockPerfumeService.searchPerfumes.and.returnValue(of(searchResults));
      component.searchTerm = 'Test';
      
      component.onSearch();
      
      expect(mockPerfumeService.searchPerfumes).toHaveBeenCalledWith('Test');
      expect(component.filteredPerfumes).toEqual(searchResults);
    });

    it('should reset filtered perfumes when search term is empty', () => {
      component.searchTerm = '';
      
      component.onSearch();
      
      expect(component.filteredPerfumes).toEqual(mockPerfumes);
      expect(mockPerfumeService.searchPerfumes).not.toHaveBeenCalled();
    });

    it('should filter by category when category is selected', () => {
      const categoryResults = [mockPerfumes[0]];
      mockPerfumeService.getPerfumesByCategoria.and.returnValue(of(categoryResults));
      component.selectedCategory = 'Masculino';
      
      component.onCategoryFilter();
      
      expect(mockPerfumeService.getPerfumesByCategoria).toHaveBeenCalledWith('Masculino');
      expect(component.filteredPerfumes).toEqual(categoryResults);
    });

    it('should reset filtered perfumes when no category is selected', () => {
      component.selectedCategory = '';
      
      component.onCategoryFilter();
      
      expect(component.filteredPerfumes).toEqual(mockPerfumes);
      expect(mockPerfumeService.getPerfumesByCategoria).not.toHaveBeenCalled();
    });

    it('should clear all filters', () => {
      component.searchTerm = 'test';
      component.selectedCategory = 'Masculino';
      
      component.clearFilters();
      
      expect(component.searchTerm).toBe('');
      expect(component.selectedCategory).toBe('');
      expect(component.filteredPerfumes).toEqual(mockPerfumes);
    });
  });

  describe('Form Validation', () => {
    it('should return true for invalid touched field', () => {
      const field = component.perfumeForm.get('nombre');
      field?.markAsTouched();
      field?.setValue('');
      
      expect(component.isFieldInvalid('nombre')).toBeTrue();
    });

    it('should return false for valid field', () => {
      const field = component.perfumeForm.get('nombre');
      field?.setValue('Valid Name');
      
      expect(component.isFieldInvalid('nombre')).toBeFalse();
    });

    it('should return correct error message for required field', () => {
      const field = component.perfumeForm.get('nombre');
      field?.markAsTouched();
      field?.setValue('');
      
      expect(component.getFieldError('nombre')).toBe('nombre es requerido');
    });

    it('should return correct error message for minlength field', () => {
      const field = component.perfumeForm.get('nombre');
      field?.markAsTouched();
      field?.setValue('a');
      
      expect(component.getFieldError('nombre')).toBe('nombre debe tener al menos 2 caracteres');
    });

    it('should return correct error message for min value field', () => {
      const field = component.perfumeForm.get('precio');
      field?.markAsTouched();
      field?.setValue(0);
      
      expect(component.getFieldError('precio')).toBe('precio debe ser mayor a 1');
    });
  });

  describe('Image Error Handling', () => {
    it('should set default image on error', () => {
      const mockEvent = {
        target: {
          src: 'error-imagen.jpg'
        }
      } as any;
      
      component.onImageError(mockEvent);
      
      expect(mockEvent.target.src).toBe('assets/images/default-perfume.webp');
    });

    it('should handle null target', () => {
      const mockEvent = {
        target: null
      } as any;
      
      expect(() => component.onImageError(mockEvent)).not.toThrow();
    });
  });

  describe('Lifecycle hooks', () => {
    it('should complete destroy$ subject on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});