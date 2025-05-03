import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FornecedorService, FornecedorCadastro} from './fornecedor-cadastro.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ViaCepService } from './viacep.service';


@Component({
  selector: 'app-fornecedores-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fornecedores-cadastro.component.html',
  styleUrls: ['./fornecedores-cadastro.component.css']
})
export class FornecedoresCadastroComponent implements OnInit {
  fornecedorForm!: FormGroup;
  errosServidor: any;

  constructor(
    private fornecedorService: FornecedorService,
    private route: Router,
    private fb: FormBuilder,
    private viaCepService: ViaCepService 
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

  cadastrarFornecedor() {
    
      const fornecedor: FornecedorCadastro = this.fornecedorForm.value;
      this.fornecedorService.cadastrarFornecedor(fornecedor).subscribe({
        next: () => {
          alert('Fornecedor cadastrado com sucesso!');
          this.fornecedorForm.reset();
          this.route.navigate(['/fornecedores']);
        },
        error: (err: { status: number; error: any; }) => {
          console.error('Erro ao cadastrar fornecedor:', err);
          if (err.status === 400 && err.error) {
            this.errosServidor = err.error;
          } 
            console.error('Erro ao cadastrar:', err);
            
          
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
          alert('CEP não encontrado.');
        }
      });
    }
  }
  
  chamarFornecedores() {
    this.route.navigate(['fornecedores']);
  }

  chamarIndex() {
    this.route.navigate(['index']);
  }

}
