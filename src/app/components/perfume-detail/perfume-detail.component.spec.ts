import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PerfumeDetailComponent } from './perfume-detail.component';
import { PerfumeService } from '../../services/perfume.service';
import { Perfume } from '../../models/perfume.model';

describe('PerfumeDetailComponent', () => {
  let component: PerfumeDetailComponent;
  let fixture: ComponentFixture<PerfumeDetailComponent>;
  let mockPerfumeService: jasmine.SpyObj<PerfumeService>;
  let mockActivatedRoute: any;

  const mockPerfume: Perfume = {
    id: 1,
    nombre: 'Test Perfume',
    marca: 'Test Marca',
    precio: 100,
    descripcion: 'Test Description',
    categoria: 'Unisex',
    imagen: 'default-perfume.webp',
    stock: 10,
    fechaCreacion: '2024-01-01',
    rating: 4.5
  };

 const mockPerfume2: Perfume = {
    id: 1,
    nombre: 'error',
    marca: 'error',
    precio: 100,
    descripcion: 'No encontrado',
    categoria: 'Unisex',
    imagen: 'default-perfume.webp',
    stock: 10,
    fechaCreacion: '2024-01-01',
    rating: 4.5
  };

  beforeEach(async () => {
    // Mock del servicio
    const spy = jasmine.createSpyObj('PerfumeService', ['getPerfumeById']);
    
    // Mock de ActivatedRoute
    mockActivatedRoute = {
      params: of({ id: '1' }),
      snapshot: {
        paramMap: {
          get: (key: string) => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [PerfumeDetailComponent],
      providers: [
        { provide: PerfumeService, useValue: spy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfumeDetailComponent);
    component = fixture.componentInstance;
    mockPerfumeService = TestBed.inject(PerfumeService) as jasmine.SpyObj<PerfumeService>;
  });

  it('should create', () => {
    mockPerfumeService.getPerfumeById.and.returnValue(of(mockPerfume));
    expect(component).toBeTruthy();
  });

  it('should load perfume on init', () => {
    mockPerfumeService.getPerfumeById.and.returnValue(of(mockPerfume));
    
    component.ngOnInit();
    
    expect(mockPerfumeService.getPerfumeById).toHaveBeenCalledWith(1);
    expect(component.perfume).toEqual(mockPerfume);
  });

  it('should handle error when perfume not found', () => {
    mockPerfumeService.getPerfumeById.and.returnValue(of(mockPerfume2));
    
    component.ngOnInit();
    
    expect(component.perfume).toBeNull();
  });
});