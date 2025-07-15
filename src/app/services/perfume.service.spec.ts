import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PerfumeService } from './perfume.service';
import { Perfume, PerfumeRequest } from '../models/perfume.model';

describe('PerfumeService', () => {
  let service: PerfumeService;
  let httpTestingController: HttpTestingController;

  const mockPerfume: Perfume = {
    id: 1,
    nombre: 'Test Perfume',
    marca: 'Test Marca',
    precio: 30000,
    descripcion: 'Test description',
    categoria: 'Unisex',
    imagen: 'default-perfume.webp',
    stock: 10,
    fechaCreacion: '2024-01-01',
    rating: 4.5
  };

  const mockPerfumeRequest: PerfumeRequest = {
    nombre: 'Test Perfume',
    marca: 'Test Marca',
    precio: 40000,
    descripcion: 'Test description',
    categoria: 'Unisex',
    imagen: 'default-perfume.webp',
    stock: 10,
    fechaCreacion: '2024-01-01',
    rating: 4.5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PerfumeService]
    });

    service = TestBed.inject(PerfumeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get perfumes', () => {
    const mockPerfumes = [mockPerfume];

    service.getPerfumes().subscribe(perfumes => {
      expect(perfumes).toEqual(mockPerfumes);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/perfumes');
    expect(req.request.method).toBe('GET');
    req.flush(mockPerfumes);
  });

  it('should create perfume', () => {
    service.createPerfume(mockPerfumeRequest).subscribe(perfume => {
      expect(perfume).toEqual(mockPerfume);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/perfumes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPerfumeRequest);
    req.flush(mockPerfume);
  });

  it('should update perfume', () => {
    const perfumeId = 1;
    
    service.updatePerfume(perfumeId, mockPerfumeRequest).subscribe(perfume => {
      expect(perfume).toEqual(mockPerfume);
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/api/perfumes/${perfumeId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPerfumeRequest);
    req.flush(mockPerfume);
  });

  it('should delete perfume', () => {
    const perfumeId = 1;
    
    service.deletePerfume(perfumeId).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/api/perfumes/${perfumeId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  it('should search perfumes', () => {
    const searchTerm = 'test';
    const mockPerfumes = [mockPerfume];

    service.searchPerfumes(searchTerm).subscribe(perfumes => {
      expect(perfumes).toEqual(mockPerfumes);
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/api/perfumes/search?term=${searchTerm}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPerfumes);
  });

  it('should get perfumes by category', () => {
    const category = 'Unisex';
    const mockPerfumes = [mockPerfume];

    service.getPerfumesByCategoria(category).subscribe(perfumes => {
      expect(perfumes).toEqual(mockPerfumes);
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/api/perfumes/category/${category}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPerfumes);
  });
});
