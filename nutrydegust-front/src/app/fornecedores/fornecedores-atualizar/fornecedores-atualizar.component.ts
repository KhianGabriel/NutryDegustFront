import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,  ActivatedRoute } from '@angular/router';
import { FornecedorService, FornecedorAtualizar} from './fornecedores-atualizar.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViaCepService } from '../fornecedores-cadastro/viacep.service';

@Component({
  selector: 'app-fornecedores-atualizar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [FornecedorService],
  templateUrl: './fornecedores-atualizar.component.html',
  styleUrls: ['./fornecedores-atualizar.component.css']
})
export class FornecedoresAtualizarComponent implements OnInit {

    fornecedorForm: FormGroup;
    id!: string;
    errosServidor: any;
  
    constructor(
      private fornecedorService: FornecedorService,
      private router: Router,
      private route: ActivatedRoute,
      private viaCepService: ViaCepService,
      private toastr: ToastrService,
      private fb: FormBuilder ) {
        this.fornecedorForm = this.fb.group({
          id: [''],
          nome: [''],
          cnpj: [''],
          telefone: [''],
          email: [''],
          cep: [''],
          estado: [''],
          cidade: [''],
          bairro: [''],
          rua: [''],
          numero: ['']
        });
       }
      
      ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
          this.fornecedorService.buscarPorId(this.id).subscribe({
            next: (fornecedor) => {
              fornecedor.cnpj = this.formatarParaExibicao(fornecedor.cnpj, 'cnpj');
              fornecedor.telefone = this.formatarParaExibicao(fornecedor.telefone, 'telefone');
              fornecedor.cep = this.formatarParaExibicao(fornecedor.cep, 'cep');
              this.fornecedorForm.patchValue(fornecedor);
            },
            error: (err) => {
              console.log(this.fornecedorForm.value);
              console.error('Erro ao buscar fornecedor:', err);
            }
          });
    }

    formatarCNPJ(event: any): void {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      
      value = value.substring(0, 14);
      
      this.fornecedorForm.get('cnpj')?.setValue(value, { emitEvent: false });
      
      if (value.length > 0) {
        value = value.replace(/^(\d{0,2})/, '$1');
        if (value.length > 2) {
          value = value.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
        }
        if (value.length > 6) {
          value = value.replace(/^(\d{2})\.(\d{3})(\d{0,3})/, '$1.$2.$3');
        }
        if (value.length > 10) {
          value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
        }
        if (value.length > 15) {
          value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
        }
      }
      
      input.value = value;
    }
  
    formatarCEP(event: any): void {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      
      value = value.substring(0, 8);
      
      this.fornecedorForm.get('cep')?.setValue(value, { emitEvent: false });
      
      if (value.length > 5) {
        value = value.replace(/^(\d{5})(\d{0,3})/, '$1-$2');
      }
      
      input.value = value;
    }
  
    formatarTelefone(event: any): void {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      
      value = value.substring(0, 11);
      
      this.fornecedorForm.get('telefone')?.setValue(value, { emitEvent: false });
      
      if (value.length > 0) {
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      }
      if (value.length > 5) {
          value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      
      input.value = value;
  }
  atualizarFornecedor(){
    if (this.fornecedorForm.valid) {
      
      const fornecedor: FornecedorAtualizar = this.fornecedorForm.value;
      fornecedor.cnpj = fornecedor.cnpj.replace(/\D/g, '');
      fornecedor.telefone = fornecedor.telefone.replace(/\D/g, '');
      fornecedor.cep = fornecedor.cep.replace(/\D/g, '');
      this.fornecedorService.atualizarFornecedor(fornecedor).subscribe({
        next: () => {
          this.toastr.success('Fornecedor editado com sucesso!');
          this.fornecedorForm.reset();
          this.router.navigate(['/fornecedores']);
        },
        error: (err) => {
          if (err.status === 400 && err.error) {
            this.errosServidor = err.error;
          } else {
            this.toastr.error('Erro ao atualizar fornecedor!');
            console.log(this.fornecedorForm.value);
          }
        }
      });
    } else {
      this.toastr.error('Preencha todos os campos obrigatórios.');
    }
  }

  buscarEnderecoPorCep() {
    const cep = this.fornecedorForm.get('cep')?.value;

    if (cep && cep.length === 8) {
      this.viaCepService.buscarCep(cep).subscribe(dados => {
        if (!dados.erro) {
          this.fornecedorForm.patchValue({
            estado: dados.uf,
            cidade: dados.localidade,
            bairro: dados.bairro,
            rua: dados.logradouro
          });
        } else {
          this.toastr.error('CEP não encontrado');
          this.fornecedorForm.get('estado')?.setValue('');
          this.fornecedorForm.get('cidade')?.setValue('');
          this.fornecedorForm.get('bairro')?.setValue('');
          this.fornecedorForm.get('rua')?.setValue('');
          this.fornecedorForm.get('numero')?.setValue('');
        }
      });
    }
  }

  formatarParaExibicao(valor: string, tipo: string): string {
    if (!valor) return '';
    
    switch (tipo) {
      case 'cnpj':
        return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      case 'telefone':
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      case 'cep':
        return valor.replace(/^(\d{5})(\d{3})$/, '$1-$2');
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
    this.router.navigate(['/fornecedores']);
  }
}

