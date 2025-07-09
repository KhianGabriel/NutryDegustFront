import { TestBed } from '@angular/core/testing';
import { EstoqueService } from './estoques.service'; 
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Adicionado para testar serviços com HttpClient


describe('EstoqueService', () => { 
  let service: EstoqueService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [EstoqueService]
    });
    service = TestBed.inject(EstoqueService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); 
  });
});