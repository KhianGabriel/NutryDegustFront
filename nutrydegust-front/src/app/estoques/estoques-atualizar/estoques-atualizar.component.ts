import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EstoqueService, Estoque, RequestEstoquePut } from './estoques-atualizar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-estoques-atualizar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './estoques-atualizar.component.html',
  styleUrls: ['./estoques-atualizar.component.css']
})
export class EstoquesAtualizarComponent implements OnInit {

  estoqueForm!: FormGroup;
  estoqueId: string | null = null;
  errosServidor: any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private estoqueService: EstoqueService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.estoqueId = this.route.snapshot.paramMap.get('id');

    this.estoqueForm = this.fb.group({
      nome: ['', Validators.required]
    });

    if (this.estoqueId) {
      this.estoqueService.getEstoqueById(this.estoqueId).subscribe(
        (estoque: Estoque) => {
          this.estoqueForm.patchValue({
            nome: estoque.nome
          });
        },
        (error) => {
          console.error('Erro ao carregar estoque para atualização:', error);
          this.toastr.error('Erro ao carregar dados do estoque.');
          this.router.navigate(['/estoque']);
        }
      );
    } else {
      this.toastr.error('ID do estoque não fornecido para atualização.');
      this.router.navigate(['/estoque']);
    }
  }

  // Método para lidar com a submissão do formulário
  atualizarEstoque(): void {
    if (this.estoqueForm.valid && this.estoqueId) {
      // --- CORREÇÃO AQUI: Crie o objeto com o tipo RequestEstoquePut ---
      const estoqueParaAtualizar: RequestEstoquePut = {
        nome: this.estoqueForm.value.nome // Apenas 'nome' é enviado no PUT
      };

      this.estoqueService.atualizarEstoque(this.estoqueId, estoqueParaAtualizar).subscribe( // Use o novo objeto
        (response: Estoque) => {
          this.toastr.success('Estoque atualizado com sucesso!');
          this.router.navigate(['/estoque']);
        },
        (error) => {
          console.error('Erro ao atualizar estoque:', error);
          this.toastr.error('Erro ao atualizar estoque.');
        }
      );
    } else {
      this.toastr.warning('Por favor, preencha o nome do estoque.');
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
    this.router.navigate(['/estoque']);
  }

}