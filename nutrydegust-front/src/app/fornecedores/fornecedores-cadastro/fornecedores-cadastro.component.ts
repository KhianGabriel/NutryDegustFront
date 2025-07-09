import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FornecedorService, FornecedorCadastro} from './fornecedores-cadastro.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ViaCepService } from './viacep.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fornecedores-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fornecedores-cadastro.component.html',
  styleUrls: ['./fornecedores-cadastro.component.css'],
})
export class FornecedoresCadastroComponent implements OnInit {
  fornecedorForm!: FormGroup;
  errosServidor: any;

  constructor(
    private fornecedorService: FornecedorService,
    private route: Router,
    private fb: FormBuilder,
    private viaCepService: ViaCepService,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.fornecedorForm = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cep: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
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

  cadastrarFornecedor() {
      const cpfControl = this.fornecedorForm.get('cnpj');
      const cpfValue = cpfControl?.value;

      const cnpjStr = String(cpfValue || '');

      const fornecedor: FornecedorCadastro = this.fornecedorForm.value;
      this.fornecedorService.cadastrarFornecedor(fornecedor).subscribe({
        next: () => {
          this.toastr.success('Fornecedor adicionado com sucesso!');
          this.fornecedorForm.reset();
          this.route.navigate(['/fornecedores']);
        },
        error: (err: { status: number; error: any; }) => {
          this.toastr.error('Erro ao cadastrar fornecedor!');
          if (err.status === 400 && err.error) {
            this.errosServidor = err.error;
          }
        }
      });
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
  
  chamarInicio(): void {
    this.route.navigate(['/index']);
  }

  chamarEstoque(): void {
    this.route.navigate(['/estoques']); 
  }

  chamarProdutos(): void {
    this.route.navigate(['/produtos']);
  }

  chamarFornecedores(): void {
    this.route.navigate(['/fornecedores']);
  }

  chamarFuncionarios(): void {
    this.route.navigate(['/funcionarios']);
  }
  
  voltarParaLista(): void {
    this.route.navigate(['/fornecedores']);
  }

}
