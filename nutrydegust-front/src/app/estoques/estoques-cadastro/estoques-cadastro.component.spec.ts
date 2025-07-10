import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoquesCadastroComponent} from './estoques-cadastro.component';

describe('EstoquesComponent', () => {
  let component: EstoquesCadastroComponent;
  let fixture: ComponentFixture<EstoquesCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoquesCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoquesCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
