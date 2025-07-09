import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FuncionariosCadastroService, FuncionarioCadastro} from './funcionarios-cadastro.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViaCepService } from './viacep.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-funcionarios-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './funcionarios-cadastro.component.html',
  styleUrls: ['./funcionarios-cadastro.component.css'],
})
export class FuncionariosCadastroComponent implements OnInit {
  funcionarioForm!: FormGroup;
  errosServidor: any = {};

  constructor(
    private funcionarioService: FuncionariosCadastroService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private viaCepService: ViaCepService,
  ) { }

  ngOnInit(): void {
    this.funcionarioForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Email com validação de formato
      cargo: ['', Validators.required],
      salario: [null, [Validators.required, Validators.min(0)]], // Salário como número, min 0
      cargaHoraria: [null, [Validators.required, Validators.min(0)]], // Carga Horária como número, min 0
      atividade: ['', Validators.required],
      cep: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
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

  cadastrarFuncionario() {
    const funcionario: FuncionarioCadastro = this.funcionarioForm.value;

      this.funcionarioService.cadastrarFuncionario(funcionario).subscribe({
        next: () => {
          this.toastr.success('Funcionário adicionado com sucesso!');
          this.funcionarioForm.reset();
          this.router.navigate(['/funcionarios']);
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error('Erro ao cadastrar funcionário!');
          console.error('Erro no cadastro de funcionário:', err);

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
    }

  formatarCEP(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    value = value.substring(0, 8);
    
    this.funcionarioForm.get('cep')?.setValue(value, { emitEvent: false });
    
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{0,3})/, '$1-$2');
    }
    
    input.value = value;
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

    buscarEnderecoPorCep() {
    const cep = this.funcionarioForm.get('cep')?.value;
    console.log('CEP digitado:', cep);
    if (cep && cep.length === 8) {
      this.viaCepService.buscarCep(cep).subscribe(dados => {
        if (!dados.erro) {
          this.funcionarioForm.patchValue({
            estado: dados.uf,
            cidade: dados.localidade,
            bairro: dados.bairro,
            rua: dados.logradouro
          });
        } else {
          this.toastr.error('CEP não encontrado');
          this.funcionarioForm.get('estado')?.setValue('');
          this.funcionarioForm.get('cidade')?.setValue('');
          this.funcionarioForm.get('bairro')?.setValue('');
          this.funcionarioForm.get('rua')?.setValue('');
          this.funcionarioForm.get('numero')?.setValue('');
        }
      });
    }
  }
  
}