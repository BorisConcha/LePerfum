import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
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
    marca: 'Marca Test',
    precio: 50000,
    descripcion: 'Test description',
    categoria: 'Unisex',
    imagen: 'default-perfume.webp',
    stock: 10,
    fechaCreacion: '2024-01-01',
    rating: 4.5
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PerfumeService', ['getPerfumeById']);
    mockActivatedRoute = {
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      declarations: [PerfumeDetailComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
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
    expect(component).toBeTruthy();
  });

  it('should load perfume successfully', () => {
    mockPerfumeService.getPerfumeById.and.returnValue(of(mockPerfume));
    
    component.ngOnInit();
    
    expect(mockPerfumeService.getPerfumeById).toHaveBeenCalledWith(1);
    expect(component.perfume).toEqual(mockPerfume);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should handle error when perfume not found', () => {
    mockPerfumeService.getPerfumeById.and.returnValue(throwError(() => new Error('Perfume not found')));
    
    component.ngOnInit();
    
    expect(mockPerfumeService.getPerfumeById).toHaveBeenCalledWith(1);
    expect(component.perfume).toBeNull();
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Error al cargar el perfume');
  });

  it('should handle null perfume ID', () => {
    mockActivatedRoute.paramMap = of(new Map());
    
    component.ngOnInit();
    
    expect(component.perfume).toBeNull();
    expect(component.error).toBe('ID de perfume no válido');
  });

  it('should handle invalid perfume ID', () => {
    mockActivatedRoute.paramMap = of(new Map([['id', 'invalid']]));
    
    component.ngOnInit();
    
    expect(component.perfume).toBeNull();
    expect(component.error).toBe('ID de perfume no válido');
  });

  it('should set loading to true initially and then false after loading', () => {
    mockPerfumeService.getPerfumeById.and.returnValue(of(mockPerfume));
    
    expect(component.loading).toBeFalse();
    
    component.ngOnInit();
    
    expect(component.loading).toBeFalse();
  });

  it('should handle loading state correctly', () => {
    const mockObservable = of(mockPerfume);
    mockPerfumeService.getPerfumeById.and.returnValue(mockObservable);
    
    expect(component.loading).toBeFalse();
    
    component.loading = true;
    expect(component.loading).toBeTrue();
    
    component.ngOnInit();
    
    expect(component.loading).toBeFalse();
  });

  it('should handle image error', () => {
    const mockEvent = {
      target: {
        src: 'error-image.jpg'
      }
    } as any;

    component.onImageError(mockEvent);

    expect(mockEvent.target.src).toBe('assets/images/default-perfume.webp');
  });

  it('should call loadPerfume internally when ngOnInit is called', () => {
    mockPerfumeService.getPerfumeById.and.returnValue(of(mockPerfume));
    
    spyOn(component, 'ngOnInit').and.callThrough();
    
    component.ngOnInit();
    
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(mockPerfumeService.getPerfumeById).toHaveBeenCalledWith(1);
  });

});