import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { ProdutoAtualizarService, Produto, RequestProdutoPut } from './produtos-atualizar.service';


@Component({
  selector: 'app-produtos-atualizar', 
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule 
  ],
  templateUrl: './produtos-atualizar.component.html',
  styleUrls: ['./produtos-atualizar.component.css']
})
export class ProdutosAtualizarComponent implements OnInit {

  produtoForm!: FormGroup;
  produtoId: string | null = null;
  errosServidor: any = {};

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private produtoAtualizarService: ProdutoAtualizarService, 
    private toastr: ToastrService 
  ) { }

  ngOnInit(): void {

    this.produtoId = this.route.snapshot.paramMap.get('id');

    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      precoVenda: ['', [Validators.required, Validators.min(0)]],
      precoCompra: ['', [Validators.required, Validators.min(0)]],
      dataValidade: ['', Validators.required],
      categoria: ['', Validators.required],
      nomeFornecedor: ['', Validators.required],
      nomeEstoque: ['', Validators.required],
      quantidadeEmEstoque: ['', [Validators.required, Validators.min(0)]],
      loteAtual: ['', Validators.required],
    });

    if (this.produtoId) {
      this.produtoAtualizarService.getProdutoById(this.produtoId).subscribe(
        (produto: Produto) => {
          const dataValidadeFormatada = produto.dataValidade ? new Date(produto.dataValidade).toISOString().substring(0, 10) : '';

          this.produtoForm.patchValue({
            nome: produto.nome,
            descricao: produto.descricao,
            precoVenda: produto.precoVenda,
            precoCompra: produto.precoCompra,
            dataValidade: dataValidadeFormatada,
            categoria: produto.categoria,
            nomeFornecedor: produto.nomeFornecedor,
            nomeEstoque: produto.nomeEstoque,
            quantidadeEmEstoque: produto.quantidadeEmEstoque,
            loteAtual: produto.loteAtual,
          });
        },
        (error) => {
          console.error('Erro ao carregar produto para atualização:', error);
          this.toastr.error('Erro ao carregar dados do produto.');
          this.router.navigate(['/produtos']);
        }
      );
    } else {
      this.toastr.error('ID do produto não fornecido para atualização.');
      this.router.navigate(['/produtos']);
    }
  }

  atualizarProduto(): void {
    this.errosServidor = {}; 

    if (this.produtoForm.valid && this.produtoId) {

      const produtoParaAtualizar: RequestProdutoPut = {
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
      };

      this.produtoAtualizarService.atualizarProduto(this.produtoId, produtoParaAtualizar).subscribe(
        (response: Produto) => { 
          this.toastr.success('Produto atualizado com sucesso!');
          this.router.navigate(['/produtos']); 
        },
        (error: HttpErrorResponse) => { // Captura o erro HTTP
          console.error('Erro ao atualizar produto:', error);
          this.toastr.error('Erro ao atualizar produto. Verifique os dados.');

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
      );
    } else {
      this.toastr.warning('Por favor, preencha todos os campos obrigatórios corretamente.');
      this.produtoForm.markAllAsTouched();
    }
  }

  chamarInicio(): void {
    this.router.navigate(['/index']);
  }

  chamarEstoque(): void {
    this.router.navigate(['/estoque']);
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