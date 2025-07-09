import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionariosAtualizarComponent } from './funcionarios-atualizar.component';

describe('FuncionariosAtualizarComponent', () => {
  let component: FuncionariosAtualizarComponent;
  let fixture: ComponentFixture<FuncionariosAtualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionariosAtualizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionariosAtualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
