import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosAtualizarComponent } from './produtos-atualizar.component';

describe('ProdutosAtualizarComponent', () => {
  let component: ProdutosAtualizarComponent;
  let fixture: ComponentFixture<ProdutosAtualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutosAtualizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutosAtualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
