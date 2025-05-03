import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedoresAtualizarComponent } from './fornecedores-atualizar.component';

describe('FornecedoresAtualizarComponent', () => {
  let component: FornecedoresAtualizarComponent;
  let fixture: ComponentFixture<FornecedoresAtualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FornecedoresAtualizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedoresAtualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
