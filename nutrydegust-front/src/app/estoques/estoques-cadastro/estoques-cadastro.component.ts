import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EstoqueService, EstoqueCadastro } from './estoques-cadastro.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-estoques-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estoques-cadastro.component.html',
  styleUrls: ['./estoques-cadastro.component.css'],
})
export class EstoquesCadastroComponent implements OnInit {
  estoqueForm!: FormGroup;
  errosServidor: any = {};

  constructor(
    private estoqueService: EstoqueService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.estoqueForm = this.fb.group({
      nome: ['', Validators.required],
    });
  }

  cadastrarEstoque() {
    this.errosServidor = {}; // Limpa os erros do servidor a cada tentativa de submissão

    if (this.estoqueForm.valid) {

      const estoque: EstoqueCadastro = this.estoqueForm.value;

      this.estoqueService.cadastrarEstoque(estoque).subscribe({
        next: () => {
          this.toastr.success('Estoque (local) adicionado com sucesso!');
          this.estoqueForm.reset();
          this.router.navigate(['/estoques']);
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error('Erro ao cadastrar estoque (local)!');
          console.error('Erro no cadastro de estoque:', err);

          if (err.status === 400 && err.error && err.error.errors) {
            err.error.errors.forEach((errorDetail: any) => {
              if (errorDetail.field) {
                this.errosServidor[errorDetail.field] = errorDetail.defaultMessage;
              }
            });
          } else if (err.error && err.error.message) {
            this.errosServidor.geral = err.error.message;
          }
        }
      });
    } else {
      // Melhoria: Adiciona uma mensagem de aviso e marca os campos como 'touched'
      // para que as mensagens de validação do Angular sejam exibidas no HTML.
      this.toastr.warning('Por favor, preencha o nome do estoque corretamente.');
      this.estoqueForm.markAllAsTouched();
    }
  }

  // Métodos de navegação (permanecem os mesmos)
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
    this.router.navigate(['/estoque']);
  }
}