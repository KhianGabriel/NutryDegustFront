import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { ProdutoCadastrarService, RequestProdutoCreate } from './produtos-cadastro.service';
import { FornecedorService, Fornecedor } from '../../fornecedores/fornecedores-listagem/fornecedores.service'; // Import do FornecedorService
import { EstoqueService, Estoque } from '../../estoques/estoques-listagem/estoques.service'; // Import do EstoqueService

@Component({
  selector: 'app-produtos-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './produtos-cadastro.component.html',
  styleUrls: ['./produtos-cadastro.component.css'],
})
export class ProdutosCadastroComponent implements OnInit {

  produtoForm!: FormGroup;
  errosServidor: any = {};
  fornecedores: Fornecedor[] = []; // Propriedade para armazenar fornecedores
  estoques: Estoque[] = [];       // Propriedade para armazenar estoques

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private produtoCadastrarService: ProdutoCadastrarService,
    private fornecedorService: FornecedorService, // Injeção do FornecedorService
    private estoqueService: EstoqueService,       // Injeção do EstoqueService
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      codigo: ['', Validators.required], // Adicionado 'codigo' aqui
      descricao: [''],
      precoVenda: ['', [Validators.required, Validators.min(0)]],
      precoCompra: ['', [Validators.required, Validators.min(0)]],
      dataValidade: ['', Validators.required],
      categoria: ['', Validators.required],
      nomeFornecedor: ['', Validators.required],
      nomeEstoque: ['', Validators.required],
      quantidadeEmEstoque: ['', [Validators.required, Validators.min(0)]],
      loteAtual: ['', Validators.required],
      // dataUltimaEntrada e dataUltimaSaida não estão no HTML para cadastro
      // Se necessário, adicione inputs correspondentes no HTML e valide aqui.
    });

    this.carregarFornecedores();
    this.carregarEstoques();
  }

  carregarFornecedores(): void {
    this.fornecedorService.getAllFornecedor().subscribe({
      next: (dados) => {
        this.fornecedores = dados;
      },
      error: (error) => {
        console.error('Erro ao carregar fornecedores:', error);
        this.toastr.error('Erro ao carregar lista de fornecedores.');
      }
    });
  }

  carregarEstoques(): void {
    this.estoqueService.getAllEstoques().subscribe({
      next: (dados) => {
        this.estoques = dados;
      },
      error: (error) => {
        console.error('Erro ao carregar estoques:', error);
        this.toastr.error('Erro ao carregar lista de estoques.');
      }
    });
  }

  cadastrarProduto(): void {
    this.errosServidor = {};

    if (this.produtoForm.valid) {
      const produtoParaCadastro: RequestProdutoCreate = {
        nome: this.produtoForm.value.nome,
        descricao: this.produtoForm.value.descricao,
        precoVenda: this.produtoForm.value.precoVenda,
        precoCompra: this.produtoForm.value.precoCompra,
        dataValidade: this.produtoForm.value.dataValidade,
        categoria: this.produtoForm.value.categoria,
        nomeFornecedor: this.produtoForm.value.nomeFornecedor,
        nomeEstoque: this.produtoForm.value.nomeEstoque,
        quantidadeEmEstoque: this.produtoForm.value.quantidadeEmEstoque,
        loteAtual: this.produtoForm.value.loteAtual,
        // Remover dataUltimaEntrada e dataUltimaSaida se não estão no RequestProdutoCreate
      };

      this.produtoCadastrarService.cadastrarProduto(produtoParaCadastro).subscribe({
        next: () => {
          this.toastr.success('Produto adicionado com sucesso!');
          this.produtoForm.reset();
          this.router.navigate(['/produtos']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao cadastrar produto:', error);
          this.toastr.error('Erro ao cadastrar produto. Verifique os dados.');

          if (error.error && error.error.errors) {
            error.error.errors.forEach((err: any) => {
              if (err.field) {
                this.errosServidor[err.field] = err.defaultMessage;
              }
            });
          } else if (error.error && error.error.message) {
            this.errosServidor.geral = error.error.message;
          }
        }
      });
    } else {
      this.toastr.warning('Por favor, preencha todos os campos obrigatórios corretamente.');
      this.produtoForm.markAllAsTouched();
    }
  }

  // Métodos de navegação
  chamarInicio(): void {
    this.router.navigate(['/index']);
  }

  chamarEstoque(): void {
    this.router.navigate(['/estoques']); // Rota corrigida
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
    this.router.navigate(['/produtos']);
  }
}