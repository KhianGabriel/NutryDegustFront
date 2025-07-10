import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { FuncionarioService,FuncionarioAtualizar } from './funcionarios-atualizar.service';
import { ViaCepService } from '../funcionarios-cadastro/viacep.service';

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
    private funcionarioService: FuncionarioService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private viaCepService: ViaCepService,
    private fb: FormBuilder
  ) {
    this.funcionarioForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cargo: ['', Validators.required],
      salario: [0, [Validators.required]],
      cargaHoraria: [0, [Validators.required]],
      atividade: ['', Validators.required],
      cep: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.funcionarioService.buscarProdutoPorId(this.id).subscribe({
      next: (funcionario) => {
        try {
          this.funcionarioForm.patchValue({
            nome: funcionario.nome,
            cpf: funcionario.cpf, // Usar o formatado
            telefone: funcionario.telefone, // Usar o formatado
            email: funcionario.email,
            cargo: funcionario.cargo,
            salario: funcionario.salario,
            cargaHoraria: funcionario.cargaHoraria,
            atividade: funcionario.atividade,
            cep: funcionario.cep,
            estado: funcionario.estado,
            cidade: funcionario.cidade,
            rua: funcionario.rua,
            numero: funcionario.numero,
            bairro: funcionario.bairro
          });
        } catch (e) {
          console.error("Erro ao formatar dados para o formulário:", e);
          this.toastr.error("Dados do funcionário recebidos em formato inválido.");
          this.router.navigate(['/funcionarios']);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar funcionário:', err);
        this.toastr.error('Erro ao carregar dados do funcionário.');
        this.router.navigate(['/funcionarios']);
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
      const funcionarioParaAtualizar: FuncionarioAtualizar = {
        nome: this.funcionarioForm.value.nome,
        cpf: this.funcionarioForm.value.cpf.replace(/\D/g, ''),
        telefone: this.funcionarioForm.value.telefone.replace(/\D/g, ''),
        email: this.funcionarioForm.value.email,
        cargo: this.funcionarioForm.value.cargo,
        salario: this.funcionarioForm.value.salario,
        cargaHoraria: this.funcionarioForm.value.cargaHoraria,
        atividade: this.funcionarioForm.value.atividade,
        cep: this.funcionarioForm.value.cep.replace(/\D/g, ''), // Limpa o CEP para envio
        estado: this.funcionarioForm.value.estado,
        cidade: this.funcionarioForm.value.cidade,
        rua: this.funcionarioForm.value.rua,
        numero: this.funcionarioForm.value.numero,
        bairro: this.funcionarioForm.value.bairro
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