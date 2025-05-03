import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,  ActivatedRoute } from '@angular/router';
import { FornecedorService, FornecedorAtualizar} from './fornecedores-atualizar.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
        console.log('ID do fornecedor:', this.id);
          this.fornecedorService.buscarPorId(this.id).subscribe({
            next: (fornecedor) => {
              this.fornecedorForm.patchValue(fornecedor);
            },
            error: (err) => {
              console.log(this.fornecedorForm.value);
              console.error('Erro ao buscar fornecedor:', err);
              alert('Erro ao carregar os dados do fornecedor.');
            }
          });
    }


  atualizarFornecedor(){
    if (this.fornecedorForm.valid) {
      const fornecedor: FornecedorAtualizar = this.fornecedorForm.value;
      console.log('Fornecedor a ser atualizado:', fornecedor);
      this.fornecedorService.atualizarFornecedor(fornecedor).subscribe({
        next: () => {
          alert('Fornecedor atualizado com sucesso!');
          this.fornecedorForm.reset();
          this.router.navigate(['/fornecedores']);
        },
        error: (err) => {
          if (err.status === 400 && err.error) {
            this.errosServidor = err.error; // armazena os erros por campo
          } else {
            console.log(this.fornecedorForm.value);
            console.error('Erro ao atualizar:', err);
            alert('Erro ao atualizar fornecedor.');
          }
        }
      });
    } else {
      alert('Preencha todos os campos obrigatórios.');
    }
  }

  chamarFornecedores() {
    this.router.navigate(['fornecedores']);
  }

  chamarIndex() {
    this.router.navigate(['index']);
  }

}
