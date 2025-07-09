import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoquesAtualizarComponent } from './estoques-atualizar.component';

describe('EstoquesAtualizarComponent', () => {
  let component: EstoquesAtualizarComponent;
  let fixture: ComponentFixture<EstoquesAtualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoquesAtualizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoquesAtualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
