import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http'; 
import { FuncionariosAtualizarService, Funcionario, RequestFuncionarioPut } from './funcionarios-atualizar.service';


@Component({
  selector: 'app-funcionarios-atualizar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './funcionarios-atualizar.component.html',
  styleUrls: ['./funcionarios-atualizar.component.css']
})
export class FuncionariosAtualizarComponent implements OnInit { 

  funcionarioForm!: FormGroup;
  id!: string; 
  errosServidor: any = {};

  constructor(
    private funcionarioService: FuncionariosAtualizarService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.funcionarioForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cargo: ['', Validators.required],
      dataContratacao: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!; 
    this.funcionarioService.getFuncionarioById(this.id).subscribe({
      next: (funcionario: Funcionario) => {
        funcionario.cpf = this.formatarParaExibicao(funcionario.cpf, 'cpf');
        funcionario.telefone = this.formatarParaExibicao(funcionario.telefone, 'telefone');

        const dataContratacaoFormatada = funcionario.dataContratacao ? new Date(funcionario.dataContratacao).toISOString().substring(0, 10) : '';

        this.funcionarioForm.patchValue({
          id: funcionario.id,
          nome: funcionario.nome,
          cpf: funcionario.cpf,
          telefone: funcionario.telefone,
          email: funcionario.email,
          cargo: funcionario.cargo,
          dataContratacao: dataContratacaoFormatada
        });
      },
      error: (err) => {
        console.error('Erro ao buscar funcionário:', err);
        this.toastr.error('Erro ao carregar dados do funcionário.');
        this.router.navigate(['/funcionarios']);
      }
    });
  }

  formatarCPF(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); 
    value = value.substring(0, 11);
    this.funcionarioForm.get('cpf')?.setValue(value, { emitEvent: false });

    if (value.length > 0) {
      value = value.replace(/^(\d{3})/, '$1');
      if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{3})/, '$1.$2');
      }
      if (value.length > 6) {
        value = value.replace(/^(\d{3})\.(\d{3})(\d{3})/, '$1.$2.$3');
      }
      if (value.length > 9) {
        value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    }
    input.value = value;
  }

  formatarTelefone(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); 
    value = value.substring(0, 11);
    this.funcionarioForm.get('telefone')?.setValue(value, { emitEvent: false });

    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    }
    if (value.length > 9) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    input.value = value;
  }

  atualizarFuncionario(): void {
    this.errosServidor = {};

    if (this.funcionarioForm.valid) {
      const funcionarioParaAtualizar: RequestFuncionarioPut = {
        nome: this.funcionarioForm.value.nome,
        cpf: this.funcionarioForm.value.cpf.replace(/\D/g, ''), 
        telefone: this.funcionarioForm.value.telefone.replace(/\D/g, ''),
        email: this.funcionarioForm.value.email,
        cargo: this.funcionarioForm.value.cargo,
        dataContratacao: this.funcionarioForm.value.dataContratacao
      };

      this.funcionarioService.atualizarFuncionario(this.id, funcionarioParaAtualizar).subscribe({
        next: () => {
          this.toastr.success('Funcionário editado com sucesso!');
          this.router.navigate(['/funcionarios']);
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error('Erro ao atualizar funcionário!');
          console.error('Erro ao atualizar funcionário:', err);

          if (err.status === 400 && err.error && err.error.errors) {
            err.error.errors.forEach((errorDetail: any) => {
              if (errorDetail.field) {
                this.errosServidor[errorDetail.field] = errorDetail.defaultMessage;
              } else {
                this.errosServidor.geral = errorDetail.defaultMessage;
              }
            });
          } else if (err.error && err.error.message) {
            this.errosServidor.geral = err.error.message;
          } else {
            this.errosServidor.geral = 'Ocorreu um erro inesperado no servidor.';
          }
        }
      });
    } else {
      this.toastr.error('Preencha todos os campos obrigatórios.');
      this.funcionarioForm.markAllAsTouched();
    }
  }

  formatarParaExibicao(valor: string, tipo: string): string {
    if (!valor) return '';

    switch (tipo) {
      case 'cpf':
        return valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
      case 'telefone':
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      default:
        return valor;
    }
  }

  chamarInicio(): void {
    this.router.navigate(['/index']);
  }

  chamarEstoque(): void {
    this.router.navigate(['/estoques']);
  }

  chamarProdutos(): void {
    this.router.navigate(['/produtos']);
  }

  chamarFornecedores(): void {
    this.router.navigate(['/fornecedores']);
  }

  chamarFuncionarios(): void {
    this.router.navigate(['/funcionarios']);
  }

  voltarParaLista(): void {
    this.router.navigate(['/funcionarios']);
  }
}