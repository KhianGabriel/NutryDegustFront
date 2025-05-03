import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FornecedoresCadastroComponent } from './fornecedores-cadastro.component';

describe('FornecedoresCadastroComponent', () => {
  let component: FornecedoresCadastroComponent;
  let fixture: ComponentFixture<FornecedoresCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FornecedoresCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedoresCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
